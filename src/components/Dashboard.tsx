"use client";

import { useDisclosure } from "@mantine/hooks";
import { IconLoader3 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { AddNoteForm } from "@/components/AddNoteForm";
import { KeyGenerationModal } from "@/components/encryptionModal";
import NotesList from "@/components/NotesList";
import SignIn from "@/components/sign-in";
import { importPrivateKey, importPublicKey } from "@/lib/asymmetricKeyManager";
import { authClient } from "@/lib/auth-client";
import { EditNoteForm } from "./Note";
import { ActionIcon } from "@mantine/core";

type EncryptionKeyResp = { encryptionKey: string };

export interface DecryptedNoteType {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const EMPTY_NOTE: DecryptedNoteType = {
  id: "",
  title: "",
  content: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const [publicKey, setPublicKey] = useState<CryptoKey | null>(null);

  const [keyModalOpened, { open: openKeyModal, close: closeKeyModal }] =
    useDisclosure(false);

  const [
    editNoteModalOpened,
    { open: openEditNoteModal, close: closeEditNoteModal },
  ] = useDisclosure(false);

  const [selectedNote, setSelectedNote] =
    useState<DecryptedNoteType>(EMPTY_NOTE);

  useEffect(() => {
    const loadPublicKey = async () => {
      const pem = secureLocalStorage.getItem("publicKey")?.toString() ?? "";

      try {
        const key = await importPublicKey(pem);
        setPublicKey(key);
      } catch (err) {
        throw new Error("failed to import public key");
      }
    };

    loadPublicKey();
  }, []);

  useEffect(() => {
    const loadPrivateKey = async () => {
      const pem = secureLocalStorage.getItem("privateKey")?.toString() ?? "";

      if (!pem) {
        openKeyModal();
        return;
      }

      try {
        const key = await importPrivateKey(pem);
        setPrivateKey(key);
      } catch (err) {
        console.log(err);
        openKeyModal();
        throw new Error("failed to import private key");
      }
    };

    loadPrivateKey();
  }, [openKeyModal]);

  useEffect(() => {
    const fetchEncryptionKey = async () => {
      if (!session?.user) return;

      try {
        const res = await fetch("/api/user/encryption-key");
        if (res.status === 404) {
          console.error("Failed to fetch public key ");
          return;
        }
        if (!res.ok) {
          throw new Error("Internal server error");
        }

        const json: EncryptionKeyResp = await res.json();
        const pem = await importPublicKey(json.encryptionKey);

        setPublicKey(pem);
        secureLocalStorage.setItem("publicKey", json.encryptionKey);
      } catch (err) {
        console.log(err);
        openKeyModal();
        throw new Error("Failed to fetch public key");
      }
    };

    if (publicKey === null && session?.user) {
      fetchEncryptionKey();
    }
  }, [session, publicKey]);

  if (isPending) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ActionIcon loading={isPending} variant="transparent">
          <IconLoader3 size={32} />
        </ActionIcon>
      </div>
    );
  }

  return (
    <>
      {!session?.user ? (
        <SignIn />
      ) : (
        <>
          <KeyGenerationModal
            opened={keyModalOpened}
            onCloseAction={closeKeyModal}
            isGeneratedUserKeys={!!publicKey}
          />
          {privateKey && publicKey && (
            <>
              <AddNoteForm publicKey={publicKey} />
              <NotesList
                privateKey={privateKey}
                setSelectedNote={setSelectedNote}
                openEditNoteModal={openEditNoteModal}
                openKeyModal={openKeyModal}
              />
              {selectedNote?.id !== "" && (
                <EditNoteForm
                  opened={editNoteModalOpened}
                  onCloseAction={closeEditNoteModal}
                  note={selectedNote}
                  publicKey={publicKey}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
