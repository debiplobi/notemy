import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [dbUser] = await db
    .select({
      encryptionKey: user.encryptionKey,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!dbUser?.encryptionKey) {
    return NextResponse.json(
      { error: "Encryption key not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    encryptionKey: dbUser.encryptionKey,
  });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { encryptionKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.encryptionKey || typeof body.encryptionKey !== "string") {
    return NextResponse.json(
      { error: "encryptionKey is required" },
      { status: 400 },
    );
  }

  const [existing] = await db
    .select({ encryptionKey: user.encryptionKey })
    .from(user)
    .where(eq(user.id, session.user.id));

  if (existing?.encryptionKey) {
    return NextResponse.json(
      { error: "Encryption key already set" },
      { status: 409 },
    );
  }

  await db
    .update(user)
    .set({
      encryptionKey: body.encryptionKey,
      updatedAt: new Date(),
    })
    .where(eq(user.id, session.user.id));

  return NextResponse.json({ success: true });
}
