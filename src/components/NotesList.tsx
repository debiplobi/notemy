"use client";
import { useQuery } from "@tanstack/react-query";
import { decryptNote } from "@/lib/asymmetricKeyManager";
import { notifications } from "@mantine/notifications";
import { SimpleGrid, Card, Text } from "@mantine/core";

import { DecryptedNoteType } from "./Dashboard";

interface EncryptedNote {
  id: string;
  ciphertext: string;
  iv: string;
  ephemeralPublicKey: string;
  createdAt: Date;
  updatedAt: Date;
}

function truncate(text: string, max = 60) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

async function fetchAndDecryptNotes(
  privateKey: CryptoKey,
): Promise<DecryptedNoteType[]> {
  const res = await fetch("/api/note", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }

  const data = await res.json();
  const decrypted: DecryptedNoteType[] = [];

  for (const note of data.notes as EncryptedNote[]) {
    const plaintext = await decryptNote(note, privateKey);
    const parsed = JSON.parse(plaintext);
    decrypted.push({
      id: note.id,
      title: parsed.title,
      content: parsed.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });
  }

  return decrypted;
}

interface PropsType {
  privateKey: CryptoKey;
  setSelectedNote: React.Dispatch<React.SetStateAction<DecryptedNoteType>>;
  openEditNoteModal: () => void;
}

export default function NotesList({
  privateKey,
  setSelectedNote,
  openEditNoteModal,
}: PropsType) {
  const {
    data: notes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: () => fetchAndDecryptNotes(privateKey),
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
      {notes.map((note: DecryptedNoteType) => (
        <Card
          key={note.id}
          p="md"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedNote(note);
            openEditNoteModal();
          }}
        >
          <Text fw={600} size="lg" mb="xs">
            {note.title}
          </Text>
          <Text size="sm" c="dimmed" style={{ whiteSpace: "pre-wrap" }} mb="xs">
            {truncate(note.content, 40)}
          </Text>
          <Text size="xs" c="dimmed">
            {new Date(
              note.updatedAt ? note.updatedAt : note.createdAt,
            ).toLocaleString()}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
}
