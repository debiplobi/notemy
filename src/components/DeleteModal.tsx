import { Modal, Group, Button, Text, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
interface PropTypes {
  id: string;
  onCloseAction: () => void;
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
export const DeleteModal = ({ id, onCloseAction }: PropTypes) => {
  // const handleCancel = () => {
  //   onCloseAction();
  // };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate();
  };

  const queryClient = useQueryClient();
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;
      await deleteNote(id);
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

  return (
    <>
      <ActionIcon
        color="red"
        variant="filled"
        size="lg"
        onClick={openDeleteModal}
        aria-label="Delete note"
      >
        <IconTrash size={20} />
      </ActionIcon>
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
};
