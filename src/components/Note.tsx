"use client";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encryptNote, importPublicKey } from "@/lib/asymmetricKeyManager";
import classes from "@/styles/NoteForms.module.css";
import type { DecryptedNoteType } from "./Dashboard";

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
}: {
  opened: boolean;
  onCloseAction: () => void;
  note: DecryptedNoteType;
  pubKey: string;
}) {
  const queryClient = useQueryClient();
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

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
        key={note.id}
        opened={opened}
        onClose={handleCancel}
        fullScreen
        radius={0}
        transitionProps={{ transition: "fade", duration: 200 }}
        classNames={{
          content: classes.modalContent,
          body: classes.modalBody,
        }}
      >
        <Box className={classes.container}>
          {/* Header */}
          <Box p="xl" className={classes.header}>
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
          <Box className={classes.contentScroll}>
            <Stack gap="md" p="xl" className={classes.formStack}>
              <TextInput
                placeholder="Enter note title..."
                size="lg"
                classNames={{
                  input: classes.titleInput,
                }}
                {...form.getInputProps("title")}
              />

              <Textarea
                placeholder="Start writing your note..."
                classNames={{
                  root: classes.contentInputRoot,
                  wrapper: classes.contentInputWrapper,
                  input: classes.contentInput,
                }}
                {...form.getInputProps("content")}
              />
            </Stack>
          </Box>

          {/* Footer */}
          <Group justify="space-between" p="xl" className={classes.footer}>
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
