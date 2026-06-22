"use client";
import { Autocomplete, Card, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Masonry from "react-masonry-css";
import { decryptNote } from "@/lib/asymmetricKeyManager";
import type { DecryptedNoteType } from "./Dashboard";
import LoadingScreen from "./LoadingIcon";
import { RichTextEditorPreview } from "./RichTextEditorPreview";

interface EncryptedNote {
  id: string;
  ciphertext: string;
  iv: string;
  ephemeralPublicKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export function truncateText(text: string, max: number) {
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

  // Masonry breakpoints for responsive columns
  const breakpointColumns = {
    default: 4, // Desktop (≥ 1280px)
    1280: 4,
    1024: 3, // Small desktop
    768: 2, // Tablet
    640: 2, // Small tablet
    480: 1, // Mobile
  };

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

      {/* Notes Masonry Grid */}
      {filteredNotes.length === 0 ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Text c="dimmed">No notes found matching "{searchQuery}"</Text>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid-column"
        >
          {filteredNotes.map((note: DecryptedNoteType) => (
            <Card
              key={note.id}
              p="0"
              shadow="sm"
              withBorder
              style={{
                cursor: "pointer",
                marginBottom: "1rem",
              }}
              onClick={() => {
                setSelectedNote(note);
                openEditNoteModal();
              }}
            >
              {note.title && (
                <Text fw={600} size="1rem" p="md">
                  {truncateText(note.title, 30)}
                </Text>
              )}
              {note.content && (
                <RichTextEditorPreview
                  key={`${note.id}-${note.updatedAt}`}
                  value={note.content}
                  maxChars={500}
                />
              )}
            </Card>
          ))}
        </Masonry>
      )}

      <style jsx global>{`
        .masonry-grid {
          display: flex;
          margin-left: -1rem;
          width: auto;
        }
        .masonry-grid-column {
          padding-left: 1rem;
          background-clip: padding-box;
        }
      `}</style>
    </Stack>
  );
}
