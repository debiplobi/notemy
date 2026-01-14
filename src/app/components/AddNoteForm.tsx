"use client";
import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Group,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encryptNote, importPublicKey } from "@/app/utils/asymmetricKeyManager";
import { notifications } from "@mantine/notifications";

interface EncryptedNote {
  ciphertext: string;
  iv: string;
  ephemeralPublicKey: string;
}

async function addNote(
  encryptedNote: EncryptedNote
): Promise<void> {
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

export function AddNoteForm({ pubKey }: { pubKey: string }) {
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
    },
    validate: {
      title: (value) => (!value.trim() ? "Title is required" : null),
      content: (value) => (!value.trim() ? "Content is required" : null),
    },
  });

  const mutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      // Invalidate and refetch notes
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      
      notifications.show({
        title: "Success",
        message: "Note has been added",
        color: "green",
      });

      form.reset();
      close();
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
    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleCancel}
        fullScreen
        radius={0}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
            fontWeight: 900,
          }}
        >
          ADD NEW NOTE
        </h2>
        <Box
          style={{
            height: "80vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            p="md"
            style={{
              flexShrink: 0,
            }}
          >
            <TextInput
              placeholder="Title"
              size="lg"
              styles={{
                input: {
                  fontSize: "1rem",
                  fontWeight: 700,
                },
              }}
              {...form.getInputProps("title")}
            />
          </Box>
          <Box
            p="md"
            style={{
              flex: 1,
              overflow: "hidden",
            }}
          >
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
            style={{
              flexShrink: 0,
              borderTop: "1px solid var(--mantine-color-gray-3)",
              background: "var(--mantine-color-body)",
            }}
          >
            <Button variant="subtle" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={() => form.onSubmit(handleSubmit)()} 
              color="blue"
              loading={mutation.isPending}
            >
              Save
            </Button>
          </Group>
        </Box>
      </Modal>
      <Button variant="default" onClick={open} size="md">
        Add New Note
      </Button>
    </>
  );
}
