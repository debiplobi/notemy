/**
 * User Note Encryption Manager (Single-User E2EE)
 *
 * - Zero-knowledge notes
 * - Server stores only ciphertext
 * - User owns one long-term X25519 keypair
 *
 * CRYPTO:
 * - X25519 (ECDH)
 * - HKDF-SHA-256
 * - AES-256-GCM
 */

export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export interface ExportedKeys {
  publicKeyPem: string;
  privateKeyPem: string;
}

export interface EncryptedNote {
  ciphertext: string;        // base64
  iv: string;                // base64
  ephemeralPublicKey: string; // base64 (raw)
}

/* ------------------------------------------------------------------ */
/* Key generation (run once per user)                                  */
/* ------------------------------------------------------------------ */

export async function generateUserKeyPair(): Promise<KeyPair> {
  return crypto.subtle.generateKey(
    { name: "X25519" },
    true,
    ["deriveBits"],
  ) as Promise<KeyPair>;
}

/* ------------------------------------------------------------------ */
/* PEM helpers                                                        */
/* ------------------------------------------------------------------ */

export function arrayBufferToPem(
  buffer: ArrayBuffer,
  label: "PUBLIC KEY" | "PRIVATE KEY",
): string {
  const base64 = Buffer.from(buffer).toString("base64");
  const body = base64.match(/.{1,64}/g)?.join("\n") ?? base64;
  return `-----BEGIN ${label}-----\n${body}\n-----END ${label}-----`;
}

export function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN [^-]+-----/, "")
    .replace(/-----END [^-]+-----/, "")
    .replace(/\s+/g, "");
  return Buffer.from(base64, "base64").slice().buffer;
}

/* ------------------------------------------------------------------ */
/* Export / Import                                                    */
/* ------------------------------------------------------------------ */

export async function exportKeyPair(
  keyPair: KeyPair,
): Promise<ExportedKeys> {
  const priv = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const pub = await crypto.subtle.exportKey("spki", keyPair.publicKey);

  return {
    privateKeyPem: arrayBufferToPem(priv, "PRIVATE KEY"),
    publicKeyPem: arrayBufferToPem(pub, "PUBLIC KEY"),
  };
}

export async function importPrivateKey(pem: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(pem),
    { name: "X25519" },
    false,
    ["deriveBits"],
  );
}

export async function importPublicKey(pem: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "spki",
    pemToArrayBuffer(pem),
    { name: "X25519" },
    false,
    [],
  );
}

/* ------------------------------------------------------------------ */
/* NOTE ENCRYPTION                                                    */
/* ------------------------------------------------------------------ */

export async function encryptNote(
  note: string,
  userPublicKey: CryptoKey,
): Promise<EncryptedNote> {
  // 1. Generate ephemeral key
  const eph = (await crypto.subtle.generateKey(
    { name: "X25519" },
    false,
    ["deriveBits"],
  )) as KeyPair;

  // 2. Derive shared secret
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: "X25519", public: userPublicKey },
    eph.privateKey,
    256,
  );

  // 3. Derive AES key via HKDF
  const hkdfKey = await crypto.subtle.importKey(
    "raw",
    sharedSecret,
    "HKDF",
    false,
    ["deriveKey"],
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(0),
      info: new TextEncoder().encode("note-encryption"),
    },
    hkdfKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );

  // 4. Encrypt
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    new TextEncoder().encode(note),
  );

  // 5. Export ephemeral public key
  const ephPub = await crypto.subtle.exportKey("raw", eph.publicKey);

  return {
    ciphertext: Buffer.from(ciphertext).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
    ephemeralPublicKey: Buffer.from(ephPub).toString("base64"),
  };
}

/* ------------------------------------------------------------------ */
/* NOTE DECRYPTION                                                    */
/* ------------------------------------------------------------------ */

export async function decryptNote(
  encrypted: EncryptedNote,
  userPrivateKey: CryptoKey,
): Promise<string> {
  // 1. Import ephemeral public key
  const ephPub = await crypto.subtle.importKey(
    "raw",
    Buffer.from(encrypted.ephemeralPublicKey, "base64"),
    { name: "X25519" },
    false,
    [],
  );

  // 2. Derive same shared secret
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: "X25519", public: ephPub },
    userPrivateKey,
    256,
  );

  // 3. HKDF → AES
  const hkdfKey = await crypto.subtle.importKey(
    "raw",
    sharedSecret,
    "HKDF",
    false,
    ["deriveKey"],
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(0),
      info: new TextEncoder().encode("note-encryption"),
    },
    hkdfKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );

  // 4. Decrypt
  const plaintext = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: Buffer.from(encrypted.iv, "base64"),
    },
    aesKey,
    Buffer.from(encrypted.ciphertext, "base64"),
  );

  return new TextDecoder().decode(plaintext);
}
