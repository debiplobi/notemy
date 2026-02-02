import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { note } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  // 1️⃣ Authenticate user
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2️⃣ Parse body
  let body: {
    ciphertext?: string;
    iv?: string;
    ephemeralPublicKey?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { ciphertext, iv, ephemeralPublicKey } = body;

  // 3️⃣ Validate payload
  if (
    typeof ciphertext !== "string" ||
    typeof iv !== "string" ||
    typeof ephemeralPublicKey !== "string"
  ) {
    return NextResponse.json(
      { error: "Invalid encrypted note payload" },
      { status: 400 },
    );
  }

  // 4️⃣ Insert note
  const [created] = await db
    .insert(note)
    .values({
      id: randomUUID(),
      userId: session.user.id,
      ciphertext,
      iv,
      ephemeralPublicKey,
    })
    .returning({
      id: note.id,
      createdAt: note.createdAt,
    });

  // 5️⃣ Return success
  return NextResponse.json(
    {
      success: true,
      noteId: created.id,
      createdAt: created.createdAt,
    },
    { status: 201 },
  );
}

export async function GET(request: Request) {
  // 1️⃣ Authenticate user
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2️⃣ Fetch notes (only user's)
  const notes = await db
    .select({
      id: note.id,
      ciphertext: note.ciphertext,
      iv: note.iv,
      ephemeralPublicKey: note.ephemeralPublicKey,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    })
    .from(note)
    .where(eq(note.userId, session.user.id))
    .orderBy(desc(note.createdAt));

  // 3️⃣ Return encrypted notes
  return NextResponse.json(
    {
      success: true,
      notes,
    },
    { status: 200 },
  );
}

export async function DELETE(request: Request) {
  // 1️⃣ Authenticate user
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2️⃣ Check if user has any notes
  const userNotes = await db
    .select({ id: note.id })
    .from(note)
    .where(eq(note.userId, session.user.id));

  if (userNotes.length > 0) {
    // 3️⃣ Delete all notes for this user
    await db.delete(note).where(eq(note.userId, session.user.id));
  }

  // 4️⃣ Return success with count
  return NextResponse.json({
    success: true,
    message: `Successfully deleted all notes`,
  });
}
