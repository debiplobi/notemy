"use client";
import {
  Alert,
  Button,
  CopyButton,
  FileButton,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import {
  type ExportedKeys,
  exportKeyPair,
  generateUserKeyPair,
  importPrivateKey,
} from "@/lib/asymmetricKeyManager";
import { logoutFn } from "./NavigationBar";

export function KeyGenerationModal({
  opened,
  onCloseAction,
  isGeneratedUserKeys,
}: {
  opened: boolean;
  onCloseAction: () => void;
  isGeneratedUserKeys: boolean;
}) {
  const [keys, setKeys] = useState<ExportedKeys | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [privateKeyInput, setPrivateKeyInput] = useState("");
  const [importError, setImportError] = useState("");

  const handleUploadPubKeyToServer = async (
    pubKeyPem: string,
    privKeyPem: string,
  ) => {
    const resp = await fetch("/api/user/encryption-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        encryptionKey: pubKeyPem,
      }),
    });
    if (resp.status === 200) {
      onCloseAction();
      secureLocalStorage.setItem("privateKey", privKeyPem);
      window.location.reload();
    } else {
      throw new Error("failed to sent public key to server");
    }
  };

  const generateKeys = async () => {
    try {
      setIsGenerating(true);
      // Generate the key pair
      const keyPair = await generateUserKeyPair();

      // Export to PEM format
      const exportedKeys = await exportKeyPair(keyPair);

      setKeys(exportedKeys);
    } catch (error) {
      console.error("Failed to generate keys:", error);
      alert("Failed to generate keys. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPrivateKey = () => {
    if (!keys) return;

    const blob = new Blob([keys.privateKeyPem], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notemy_private_key.pem";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    try {
      const text = await file.text();
      setPrivateKeyInput(text);
      setImportError("");
    } catch (_error) {
      setImportError("Failed to read file. Please try again.");
      throw new Error("failed to read file");
    }
  };

  const handleImportKey = async () => {
    try {
      setImportError("");

      // Validate the key
      await importPrivateKey(privateKeyInput);

      // Store key
      secureLocalStorage.setItem("privateKey", privateKeyInput);

      // Close modal
      onCloseAction();
    } catch (_error) {
      setImportError(
        "Invalid private key format. Please check your key and try again.",
      );
    } finally {
      // 🔥 FULL window reload (hard refresh)
      window.location.reload();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      title={
        isGeneratedUserKeys ? "Import Your Private Key" : "Encryption Key Setup"
      }
      centered
      size="lg"
    >
      <Stack gap="md">
        {isGeneratedUserKeys ? (
          // IMPORT MODE - User already has keys
          <>
            <Text size="sm" c="dimmed" mt={"0.5em"}>
              Paste your private key or upload your .pem file to decrypt your
              data.
            </Text>

            {importError && (
              <Alert color="red" title="Error">
                {importError}
              </Alert>
            )}

            <Textarea
              label="Private Key"
              placeholder="-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----"
              value={privateKeyInput}
              onChange={(e) => setPrivateKeyInput(e.currentTarget.value)}
              autosize
              minRows={8}
              maxRows={15}
              styles={{
                input: {
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                },
              }}
            />

            <Group gap="xs">
              <FileButton accept=".pem,text/plain" onChange={handleFileUpload}>
                {(props) => (
                  <Button {...props} variant="light">
                    Upload .pem File
                  </Button>
                )}
              </FileButton>

              <CopyButton value={privateKeyInput}>
                {({ copied, copy }) => (
                  <Button
                    variant="subtle"
                    onClick={copy}
                    disabled={!privateKeyInput}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                )}
              </CopyButton>
            </Group>

            <Group justify="space-between" mt="md">
              <Button variant="filled" color="red" onClick={() => logoutFn()}>
                Logout
              </Button>
              <Group>
                <Button variant="default" onClick={onCloseAction}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleImportKey()}
                  disabled={!privateKeyInput}
                >
                  Import Key
                </Button>
              </Group>
            </Group>
          </>
        ) : // GENERATION MODE - New user
        !keys ? (
          <>
            <Text size="sm" c="dimmed">
              This will generate your encryption keys. The private key will be
              shown only once. Make sure to save it securely.
            </Text>
            <Button onClick={generateKeys} loading={isGenerating} fullWidth>
              Generate Keys
            </Button>
          </>
        ) : (
          <>
            <Alert color="red" title="! Important Warning">
              Save your private key securely. You will NOT see it again. Store
              it in a safe place like a password manager or download it to a
              secure location.
            </Alert>

            {/* PRIVATE KEY ONLY */}
            <div>
              <Text size="sm" fw={600} mb="xs" c="red">
                Private Key (keep secret!)
              </Text>
              <Textarea
                value={keys.privateKeyPem}
                readOnly
                autosize
                minRows={8}
                maxRows={12}
                styles={{
                  input: {
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                  },
                }}
              />
              <Group mt="xs" gap="xs">
                <CopyButton value={keys.privateKeyPem}>
                  {({ copied, copy }) => (
                    <Button
                      color="red"
                      variant="light"
                      onClick={copy}
                      size="xs"
                    >
                      {copied ? "Copied!" : "Copy Private Key"}
                    </Button>
                  )}
                </CopyButton>
                <Button
                  color="red"
                  variant="subtle"
                  onClick={downloadPrivateKey}
                  size="xs"
                >
                  Download as .pem
                </Button>
              </Group>
            </div>
            <Group justify="flex-end" mt="md">
              <Button
                onClick={() =>
                  handleUploadPubKeyToServer(
                    keys.publicKeyPem,
                    keys.privateKeyPem,
                  )
                }
                variant="filled"
              >
                I've Saved My Key
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}
