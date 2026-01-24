"use client";
import {
  Card,
  SimpleGrid,
  Text,
  Autocomplete,
  Stack,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { IconBolt, IconSearch } from "@tabler/icons-react";
import { useState, useMemo } from "react";
import { decryptNote } from "@/lib/asymmetricKeyManager";
import type { DecryptedNoteType } from "./Dashboard";
import LoadingScreen from "./LoadingIcon";

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
  privateKey: CryptoKey | null;
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
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: notes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!privateKey) {
        openKeyModal();
        throw new Error("Private key is null");
      }
      return fetchAndDecryptNotes(privateKey);
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!privateKey,
  });

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    if (!searchQuery.trim()) return notes;

    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query),
    );
  }, [notes, searchQuery]);

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

  if (isLoading && !notes) {
    return <LoadingScreen />;
  }

  if (!isLoading && (!notes || notes.length === 0)) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Text>No notes yet.</Text>
      </div>
    );
  }

  return (
    <Stack gap="md">
      {/* Search Bar */}
      {notes && notes.length > 0 && (
        <Autocomplete
          placeholder="Search notes..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={setSearchQuery}
          limit={5}
          maxDropdownHeight={200}
          styles={{
            input: {
              paddingLeft: "2rem",
            },
          }}
        />
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Text c="dimmed">No notes found matching "{searchQuery}"</Text>
        </div>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }}>
          {filteredNotes.map((note: DecryptedNoteType) => (
            <Card
              key={note.id}
              p="md"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedNote(note);
                openEditNoteModal();
              }}
            >
              <Title fw={600} size="1.1rem">
                {truncate(note.title, 30)}
              </Title>
              <Text
                c="gray.7"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {truncate(note.content, 100)}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
