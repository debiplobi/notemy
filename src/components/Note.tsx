"use client";
import {
  Box,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encryptNote } from "@/lib/asymmetricKeyManager";
import type { DecryptedNoteType } from "./Dashboard";
import { DeleteModal } from "./DeleteModal";
import { RichTextEditorComp } from "./RichTextEditor";

interface EncryptedNotePayload {
  ciphertext: string;
  iv: string;
  ephemeralPublicKey: string;
}

async function updateNote(noteId: string, encryptedNote: EncryptedNotePayload) {
  const res = await fetch(`/api/note/${noteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(encryptedNote),
  });

  if (!res.ok) {
    throw new Error("Failed to update note");
  }
}

export function EditNoteForm({
  opened,
  onCloseAction,
  note,
  publicKey,
}: {
  opened: boolean;
  onCloseAction: () => void;
  note: DecryptedNoteType;
  publicKey: CryptoKey;
}) {
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      id: "",
      title: "",
      content: "",
    },
  });

  if (opened && note && form.values.id !== note.id) {
    form.setValues({
      title: note.title,
      content: note.content,
      id: note.id,
    });
  }

  const updateMutation = useMutation({
    mutationFn: async (values: { title: string; content: string }) => {
      if (!note) return;
      const payload = JSON.stringify(values);
      const encrypted = await encryptNote(payload, publicKey);
      await updateNote(note.id, encrypted);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      notifications.show({
        title: "Saved",
        message: "Note updated successfully",
        color: "green",
      });
      onCloseAction();
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to update note",
        color: "red",
      });
    },
  });

  const handleCancel = () => {
    onCloseAction();
  };

  const displayedDate = updateMutation.isSuccess
    ? new Date().toLocaleString()
    : new Date(note.updatedAt ?? note.createdAt).toLocaleString();

  return (
    <Modal
      key={note.id}
      opened={opened}
      onClose={handleCancel}
      fullScreen
      radius={0}
      title={"Edit Note"}
      transitionProps={{ transition: "fade", duration: 200 }}
      styles={{
        content: {
          display: "flex",
          flexDirection: "column",
        },
        body: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 0,
        },
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack
            gap="md"
            p="xl"
            style={{
              flex: 1,
            }}
          >
            <TextInput
              placeholder="Enter note title..."
              size="lg"
              styles={{
                input: {
                  fontSize: "1.1rem",
                  padding: "0.5rem",
                },
              }}
              {...form.getInputProps("title")}
            />
            <RichTextEditorComp
              value={form.values.content}
              onChange={(value) => form.setFieldValue("content", value)}
            />
          </Stack>
        </Box>
      </Box>
      {/* Footer */}
      <Group p="md" w="100%" wrap="wrap" gap="sm">
        <Text size="xs" c="dimmed" w={{ base: "100%", sm: "auto" }}>
          {note.updatedAt ? "Last edited: " : "Created: "}
          {displayedDate}
        </Text>

        <Group
          justify="space-between"
          w={{ base: "100%", sm: "auto" }}
          style={{ flex: 1 }}
          wrap="wrap"
        >
          <DeleteModal id={note.id} onCloseAction={onCloseAction} />
          <Group gap="sm">
            <Button variant="subtle" onClick={handleCancel} color="gray">
              Cancel
            </Button>
            <Button
              loading={updateMutation.isPending}
              onClick={() =>
                form.onSubmit((values) => updateMutation.mutate(values))()
              }
            >
              Save Changes
            </Button>
          </Group>
        </Group>
      </Group>
    </Modal>
  );
}
