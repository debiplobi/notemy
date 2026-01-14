"use client";
import { useQuery } from "@tanstack/react-query";
import { decryptNote } from "@/app/utils/asymmetricKeyManager";
import { notifications } from "@mantine/notifications";
import { SimpleGrid } from "@mantine/core";

interface EncryptedNote {
  id: string;
  ciphertext: string;
  iv: string;
  ephemeralPublicKey: string;
  createdAt: string;
}

interface DecryptedNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

function truncate(text: string, max = 60) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

async function fetchAndDecryptNotes(
  userPrivateKey: CryptoKey,
): Promise<DecryptedNote[]> {
  const res = await fetch("/api/note", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }

  const data = await res.json();
  const decrypted: DecryptedNote[] = [];

  for (const note of data.notes as EncryptedNote[]) {
    const plaintext = await decryptNote(note, userPrivateKey);
    const parsed = JSON.parse(plaintext);
    decrypted.push({
      id: note.id,
      title: parsed.title,
      content: parsed.content,
      createdAt: note.createdAt,
    });
  }

  return decrypted;
}

export default function NotesList({
  userPrivateKey,
}: {
  userPrivateKey: CryptoKey;
}) {
  const {
    data: notes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: () => fetchAndDecryptNotes(userPrivateKey),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 1,
  });

  // Show error notification when query fails
  if (isError) {
    notifications.show({
      title: "Error",
      message: error instanceof Error ? error.message : "Failed to load notes",
      color: "red",
    });
  }

  if (isLoading) {
    return <p>Loading notes…</p>;
  }

  if (!notes || notes.length === 0) {
    return <p>No notes yet.</p>;
  }

  return (
    <SimpleGrid cols={3}>
      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            border: "1px solid #333",
            borderRadius: 8,
            padding: "1rem",
          }}
        >
          <h3>{note.title}</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{truncate(note.content, 40)}</p>
          <small>{new Date(note.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </SimpleGrid>
  );
}
