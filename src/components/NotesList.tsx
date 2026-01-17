"use client";
import { Card, SimpleGrid, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { decryptNote } from "@/lib/asymmetricKeyManager";

import type { DecryptedNoteType } from "./Dashboard";

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
  return `${text.slice(0, max).trimEnd()}…`;
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
  openKeyModal: () => void;
}

export default function NotesList({
  privateKey,
  setSelectedNote,
  openEditNoteModal,
  openKeyModal,
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
    if (error?.name === "OperationError") {
      notifications.show({
        title: "Invalid Private Key",
        message: "Please provide correct private key",
        color: "red",
      });
      openKeyModal();
    } else {
      notifications.show({
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to load notes",
        color: "red",
      });
    }
  }

  if (!isLoading && (!notes || notes.length === 0)) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Text>No notes yet.</Text>
      </div>
    );
  }

  if (isLoading && !notes) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Text>Decrypting Notes...</Text>
      </div>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
      {notes?.map((note: DecryptedNoteType) => (
        <Card
          key={note.id}
          p="md"
          className="cursor-pointer"
          onClick={() => {
            setSelectedNote(note);
            openEditNoteModal();
          }}
        >
          <Text fw={600}>{note.title}</Text>
          <Text
            c="dimmed"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {truncate(note.content, 100)}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
}
