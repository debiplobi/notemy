"use client";

import { useDisclosure } from "@mantine/hooks";
import { IconBolt } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { AddNoteForm } from "@/components/AddNoteForm";
import { KeyGenerationModal } from "@/components/encryptionModal";
import LandingPage from "@/components/LandingPage";
import NotesList from "@/components/NotesList";
import { importPrivateKey, importPublicKey } from "@/lib/asymmetricKeyManager";
import { authClient } from "@/lib/auth-client";
import { loadPrivateKey } from "@/lib/keyStorage";
import { EditNoteForm } from "./Note";

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
  const [publicKeyLoading, setPublicKeyLoading] = useState(true);
  const [privateKeyLoading, setPrivateKeyLoading] = useState(true);
  const [serverKeyLoading, setServerKeyLoading] = useState(false);

  const [keyModalOpened, { open: openKeyModal, close: closeKeyModal }] =
    useDisclosure(false);

  const [
    editNoteModalOpened,
    { open: openEditNoteModal, close: closeEditNoteModal },
  ] = useDisclosure(false);

  const [selectedNote, setSelectedNote] =
    useState<DecryptedNoteType>(EMPTY_NOTE);

  // Load public key from local storage
  useEffect(() => {
    const loadPublicKey = async () => {
      const pem = localStorage.getItem("publicKey")?.toString() ?? "";

      if (!pem) {
        setPublicKeyLoading(false);
        return;
      }

      try {
        const key = await importPublicKey(pem);
        setPublicKey(key);
      } catch (err) {
        console.error("Failed to import public key:", err);
        localStorage.removeItem("publicKey");
      } finally {
        setPublicKeyLoading(false);
      }
    };

    loadPublicKey();
  }, []);

  // Load private key from local storage
  useEffect(() => {
    const loadStoredPrivateKey = async () => {
      try {
        const privateKey = await loadPrivateKey(); // imported function
        setPrivateKey(privateKey);
      } catch (err) {
        console.error("Failed to import private key:", err);
      } finally {
        setPrivateKeyLoading(false);
      }
    };

    if (!publicKeyLoading) {
      loadStoredPrivateKey();
    }
  }, [publicKeyLoading]);

  // Fetch public key from server if not in local storage
  useEffect(() => {
    const fetchEncryptionKey = async () => {
      if (!session?.user) return;

      setServerKeyLoading(true);

      try {
        const res = await fetch("/api/user/encryption-key");
        console.log(res);
        if (res.status === 404) {
          console.error("Failed to fetch public key - not found");
          setServerKeyLoading(false);
          return;
        }
        if (!res.ok) {
          throw new Error("Internal server error");
        }

        const json: EncryptionKeyResp = await res.json();
        const pem = await importPublicKey(json.encryptionKey);

        setPublicKey(pem);
        localStorage.setItem("publicKey", json.encryptionKey);
      } catch (err) {
        console.error("Failed to fetch public key:", err);
      } finally {
        setServerKeyLoading(false);
      }
    };

    if (publicKey === null && session?.user && !publicKeyLoading) {
      fetchEncryptionKey();
    }
  }, [session, publicKey, publicKeyLoading]);
  //
  // Open modal after all loading is complete and keys are missing
  useEffect(() => {
    const allLoadingComplete =
      !publicKeyLoading && !privateKeyLoading && !serverKeyLoading;

    if (allLoadingComplete && session?.user) {
      if (!privateKey || !publicKey) {
        openKeyModal();
      }
    }
  }, [
    publicKeyLoading,
    privateKeyLoading,
    serverKeyLoading,
    privateKey,
    publicKey,
    session,
    openKeyModal,
  ]);

  const isLoading =
    isPending || publicKeyLoading || privateKeyLoading || serverKeyLoading;

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <IconBolt size="2rem" className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      {!session?.user ? (
        <LandingPage />
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
