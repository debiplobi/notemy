"use client";
import { useEffect } from "react";
import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Group,
  Box,
  Stack,
  ActionIcon,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { encryptNote, importPublicKey } from "@/lib/asymmetricKeyManager";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { DecryptedNoteType } from "./Dashboard";

interface EncryptedNotePayload {
  ciphertext: string;
  iv: string;
  ephemeralPublicKey: string;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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

async function deleteNote(noteId: string) {
  const res = await fetch(`/api/note/${noteId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete note");
  }
}

export function EditNoteForm({
  opened,
  onCloseAction,
  note,
  pubKey,
  privateKey,
}: {
  opened: boolean;
  onCloseAction: () => void;
  note: DecryptedNoteType;
  pubKey: string;
  privateKey: CryptoKey;
}) {
  const queryClient = useQueryClient();
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (!opened || !note) return;
    try {
      form.setValues({
        title: note.title,
        content: note.content,
      });
    } catch (e) {
      notifications.show({
        title: "Error",
        message: "Failed to show note",
        color: "red",
      });
    }
  }, [opened, note]);

  const updateMutation = useMutation({
    mutationFn: async (values: { title: string; content: string }) => {
      if (!note) return;
      const publicKey = await importPublicKey(pubKey);
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

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!note) return;
      await deleteNote(note.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      notifications.show({
        title: "Deleted",
        message: "Note deleted successfully",
        color: "blue",
      });
      closeDeleteModal();
      onCloseAction();
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to delete note",
        color: "red",
      });
    },
  });

  const handleCancel = () => {
    form.reset();
    onCloseAction();
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate();
  };

  const displayedDate = updateMutation.isSuccess
    ? new Date().toLocaleString()
    : new Date(note.updatedAt ?? note.createdAt).toLocaleString();

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleCancel}
        fullScreen
        radius={0}
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
          {/* Header */}
          <Box
            p="xl"
            style={(theme) => ({
              borderBottom: `1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))`,
              backgroundColor: `light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))`,
            })}
          >
            <Group justify="space-between" align="center">
              <Text size="xl" fw={700}>
                Edit Note
              </Text>
              <ActionIcon
                color="red"
                variant="filled"
                size="lg"
                onClick={openDeleteModal}
                aria-label="Delete note"
              >
                <IconTrash size={20} />
              </ActionIcon>
            </Group>
          </Box>

          {/* Content */}
          <Box
            style={{
              flex: 1,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack gap="md" p="xl" style={{ flex: 1 }}>
              <TextInput
                placeholder="Enter note title..."
                size="lg"
                styles={{
                  input: {
                    fontWeight: 600,
                    fontSize: "1.25rem",
                    border: "none",
                    borderBottom: `2px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))`,
                    borderRadius: 0,
                    padding: "0.5rem 0",
                    backgroundColor: "transparent",
                    "&:focus": {
                      borderBottomColor: "var(--mantine-color-Remoraid-6)",
                    },
                  },
                }}
                {...form.getInputProps("title")}
              />

              <Textarea
                placeholder="Start writing your note..."
                styles={{
                  root: {
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  },
                  wrapper: {
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  },
                  input: {
                    flex: 1,
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    border: "none",
                    padding: "1rem 0",
                    resize: "none",
                    backgroundColor: "transparent",
                    "&:focus": {
                      outline: "none",
                    },
                  },
                }}
                {...form.getInputProps("content")}
              />
            </Stack>
          </Box>

          {/* Footer */}
          <Group
            justify="space-between"
            p="xl"
            style={{
              borderTop: `1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))`,
              backgroundColor: `light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))`,
            }}
          >
            <Text size="xs" c="dimmed">
              {note.updatedAt ? "Last edited: " : "Created: "}
              {displayedDate}
            </Text>
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
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Delete Note"
        centered
        size="sm"
      >
        <Text size="sm" mb="lg">
          Are you sure you want to delete this note? This action cannot be
          undone and the note will be permanently removed.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={closeDeleteModal} color="gray">
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteConfirm}
            loading={deleteMutation.isPending}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
