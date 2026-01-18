"use client";
import {
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
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encryptNote } from "@/lib/asymmetricKeyManager";
import classes from "@/styles/NoteForms.module.css";
import { useDisclosure } from "@mantine/hooks";

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

export function AddNoteForm({ publicKey }: { publicKey: CryptoKey }) {
  const [opened, { open: openAddNoteModal, close: onCloseAction }] =
    useDisclosure(false);
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
      const notePayload = JSON.stringify({
        title: values.title,
        content: values.content,
      });
      const encryptedNote = await encryptNote(notePayload, publicKey);

      mutation.mutate(encryptedNote);
    } catch (_error) {
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
    <div>
      <div
        style={{
          marginBottom: "1rem",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Button variant="default" onClick={openAddNoteModal} size="md">
          Add New Note
        </Button>
      </div>
      <Modal
        opened={opened}
        onClose={handleCancel}
        fullScreen
        radius={0}
        title={"Add New Note"}
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
          {/* Content */}
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
                    fontWeight: 600,
                    fontSize: "1.25rem",
                    padding: "0.5rem",
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
                    padding: "1rem ",
                    resize: "none",
                  },
                }}
                {...form.getInputProps("content")}
              />
            </Stack>
          </Box>
        </Box>
        {/* Footer */}
        <Group
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1rem",
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
      </Modal>
    </div>
  );
}
