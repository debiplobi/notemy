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
import { encryptNote, importPublicKey } from "@/lib/asymmetricKeyManager";
import classes from "@/styles/NoteForms.module.css";

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
    <Modal
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
          <Text size="xl" fw={700} ta="center">
            Add New Note
          </Text>
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
        <Group justify="flex-end" p="xl" className={classes.footer}>
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
