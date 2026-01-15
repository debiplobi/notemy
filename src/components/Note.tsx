"use client";

import { useEffect } from "react";
import { Modal, Button, TextInput, Textarea, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  encryptNote,
  decryptNote,
  importPublicKey,
} from "@/lib/asymmetricKeyManager";
import { notifications } from "@mantine/notifications";
import { DecryptedNoteType } from "./Dashboard";

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
  console.log(res);

  if (!res.ok) {
    throw new Error("Failed to update note");
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

  const mutation = useMutation({
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

  const handleCancel = () => {
    form.reset();
    onCloseAction();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      fullScreen
      radius={0}
      transitionProps={{ transition: "fade", duration: 200 }}
    >
      <h2 style={{ textAlign: "center", fontWeight: 900 }}>EDIT NOTE</h2>

      <Box h="80vh" display="flex" style={{ flexDirection: "column" }}>
        <Box p="md">
          <TextInput
            placeholder="Title"
            size="lg"
            styles={{ input: { fontWeight: 700 } }}
            {...form.getInputProps("title")}
          />
        </Box>

        <Box p="md" style={{ flex: 1 }}>
          <Textarea
            placeholder="Content"
            minRows={1}
            styles={{
              root: {
                height: "100%",
              },
              wrapper: {
                height: "100%",
              },
              input: {
                height: "100%",
                fontSize: "0.9rem",
                resize: "none",
              },
            }}
            {...form.getInputProps("content")}
          />
        </Box>

        <Group
          justify="flex-end"
          p="md"
          style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}
        >
          <Button variant="subtle" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            loading={mutation.isPending}
            onClick={() => form.onSubmit((values) => mutation.mutate(values))()}
          >
            Save
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
