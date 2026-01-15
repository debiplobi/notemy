import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { note } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  // 1️⃣ Authenticate
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // 2️⃣ Query the note
  const result = await db.select().from(note).where(eq(note.id, id)).limit(1);

  if (!result.length) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  // Only allow access to own note
  const foundNote = result[0];
  if (foundNote.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ note: foundNote }, { status: 200 });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  // 1️⃣ Authenticate user
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing note id" }, { status: 400 });
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

  // 4️⃣ Ensure note exists & belongs to user
  const existing = await db.query.note.findFirst({
    where: and(eq(note.id, id), eq(note.userId, session.user.id)),
    columns: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  // 5️⃣ Update encrypted note
  await db
    .update(note)
    .set({
      ciphertext,
      iv,
      ephemeralPublicKey,
      updatedAt: new Date(),
    })
    .where(eq(note.id, id));

  // 6️⃣ Return success
  return NextResponse.json({ success: true }, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Delete only if own note
  await db
    .delete(note)
    .where(and(eq(note.id, id), eq(note.userId, session.user.id)));

  return NextResponse.json({ success: true }, { status: 200 });
}
