"use client";

import { useEffect, useState } from "react";
import { Button, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLoader3 } from "@tabler/icons-react";
import secureLocalStorage from "react-secure-storage";

import SignIn from "@/app/components/sign-in";
import { KeyGenerationModal } from "@/app/components/encryptionModal";
import { AddNoteForm } from "@/app/components/AddNoteForm";
import NotesList from "@/app/components/NotesList";

import { authClient } from "@/app/lib/auth-client";
import { importPrivateKey } from "@/app/utils/asymmetricKeyManager";

type EncryptionKeyResp = { encryptionKey: string };

export default function Home() {
  /* ------------------------------------------------------------------ */
  /* Auth                                                               */
  /* ------------------------------------------------------------------ */

  const { data: session, isPending } = authClient.useSession();

  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */

  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const [pubKey, setPubKey] = useState<string | null>(null);

  const [keyModalOpened, { open: openKeyModal, close: closeKeyModal }] =
    useDisclosure(false);

  const [
    addNoteModalOpened,
    { open: openAddNoteModal, close: closeaddNoteModal },
  ] = useDisclosure(false);

  /* ------------------------------------------------------------------ */
  /* Load private key from secure storage                                */
  /* ------------------------------------------------------------------ */

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
        console.error("Failed to import private key", err);
        openKeyModal();
      }
    };

    loadPrivateKey();
  }, [openKeyModal]);

  /* ------------------------------------------------------------------ */
  /* Fetch public key from server                                        */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!session?.user) return;

    let cancelled = false;

    const fetchKey = async () => {
      const res = await fetch("/api/user/encryption-key");

      if (!res.ok || cancelled) return;

      const json: EncryptionKeyResp = await res.json();
      setPubKey(json.encryptionKey);
    };

    fetchKey();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  /* ------------------------------------------------------------------ */
  /* Loading                                                            */
  /* ------------------------------------------------------------------ */

  if (isPending) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <IconLoader3
          size={32}
          style={{ animation: "spin 1s linear infinite" }}
        />
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Not logged in                                                       */
  /* ------------------------------------------------------------------ */

  if (!session?.user) {
    return (
      <Container size="xs" py={80}>
        <SignIn />
      </Container>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Main UI                                                            */
  /* ------------------------------------------------------------------ */

  return (
    <div>
      <KeyGenerationModal
        opened={keyModalOpened}
        onCloseAction={closeKeyModal}
        isGeneratedUserKeys={!!pubKey}
      />

      <div
        style={{
          marginBottom: "2em",
          display: "flex",
          justifyContent: "center",
          background: "var(--mantine-color-body)",
        }}
      >
        {pubKey && (
          <AddNoteForm
            pubKey={pubKey}
            opened={addNoteModalOpened}
            onCloseAction={closeaddNoteModal}
          />
        )}
        <Button variant="default" onClick={openAddNoteModal} size="md">
          Add New Note
        </Button>
      </div>

      {privateKey && <NotesList userPrivateKey={privateKey} />}
    </div>
  );
}
