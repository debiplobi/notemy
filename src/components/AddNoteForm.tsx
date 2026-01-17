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
  const response = await fetch("/api/note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(encryptedNote),
  });

  if (!response.ok) {
    throw new Error("Failed to add note");
  }
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
        title: "Success",
        message: "Note has been added",
        color: "green",
      });

      form.reset();
      onCloseAction();
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to add note",
        color: "red",
      });
    },
  });

  const handleSubmit = async (values: { title: string; content: string }) => {
    try {
      const publicKey = await importPublicKey(pubKey);
      const notePayload = JSON.stringify({
        title: values.title,
        content: values.content,
      });
      const encryptedNote = await encryptNote(notePayload, publicKey);

      mutation.mutate(encryptedNote);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to encrypt note",
        color: "red",
      });
    }
  };

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
          style={{
            borderBottom: `1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))`,
            backgroundColor: `light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))`,
          }}
        >
          <Text size="xl" fw={700} ta="center">
            Add New Note
          </Text>
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
          justify="flex-end"
          p="xl"
          style={{
            borderTop: `1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))`,
            backgroundColor: `light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))`,
          }}
        >
          <Button variant="subtle" onClick={handleCancel} color="gray">
            Cancel
          </Button>
          <Button
            onClick={() => form.onSubmit(handleSubmit)()}
            loading={mutation.isPending}
          >
            Save Note
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
