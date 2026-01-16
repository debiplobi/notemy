"use client";

import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Group,
  Box,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encryptNote, importPublicKey } from "@/lib/asymmetricKeyManager";
import { notifications } from "@mantine/notifications";

interface EncryptedNote {
  ciphertext: string;
  iv: string;
  ephemeralPublicKey: string;
}

async function addNote(encryptedNote: EncryptedNote): Promise<void> {
  const res = await fetch("/api/note", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(encryptedNote),
  });

  if (!res.ok) throw new Error("Failed to add note");
}

export function AddNoteForm({
  pubKey,
  opened,
  onCloseAction,
}: {
  pubKey: string;
  opened: boolean;
  onCloseAction: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      notifications.show({
        title: "Saved",
        message: "Your note has been added",
        color: "green",
      });
      form.reset();
      onCloseAction();
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to add note",
        color: "red",
      });
    },
  });

  const handleSubmit = async (values: {
    title: string;
    content: string;
  }) => {
    try {
      const publicKey = await importPublicKey(pubKey);
      const payload = JSON.stringify(values);
      const encrypted = await encryptNote(payload, publicKey);
      mutation.mutate(encrypted);
    } catch {
      notifications.show({
        title: "Encryption failed",
        message: "Unable to encrypt your note",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseAction}
      fullScreen
      radius={0}
      withCloseButton={false}
      transitionProps={{ transition: "fade", duration: 200 }}
      styles={{
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
    >
      {/* Header */}
      <Box
        px="md"
        py="sm"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom:
            "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
          backgroundColor:
            "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
        }}
      >
        <Text size="lg" fw={700} ta="center">
          Add New Note
        </Text>
      </Box>

      {/* Form */}
      <Box
        component="form"
        onSubmit={form.onSubmit(handleSubmit)}
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <Stack px="md" py="lg" gap="md" style={{ minHeight: "100%" }}>
          <TextInput
            placeholder="Title"
            size="lg"
            {...form.getInputProps("title")}
            styles={{
              input: {
                fontSize: "1.25rem",
                fontWeight: 600,
                border: "none",
                borderBottom:
                  "2px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
                borderRadius: 0,
                backgroundColor: "transparent",
              },
            }}
          />

          <Textarea
            placeholder="Start writing..."
            autosize
            minRows={10}
            {...form.getInputProps("content")}
            styles={{
              input: {
                fontSize: "1rem",
                lineHeight: 1.6,
                border: "none",
                backgroundColor: "transparent",
                resize: "none",
              },
            }}
          />
        </Stack>
      </Box>

      {/* Footer */}
      <Group
        px="md"
        py="sm"
        justify="space-between"
        style={{
          position: "sticky",
          bottom: 0,
          borderTop:
            "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
          backgroundColor:
            "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
        }}
      >
        <Button
          variant="subtle"
          color="gray"
          onClick={onCloseAction}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>

        <Button type="submit" loading={mutation.isPending}>
          Save
        </Button>
      </Group>
    </Modal>
  );
}
