const DB_NAME = "user-keystore";
const STORE_NAME = "keys";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE_NAME)) {
        req.result.createObjectStore(STORE_NAME);
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => Promise<T> | T,
): Promise<T> {
  const db = await openDb();

  const tx = db.transaction(STORE_NAME, mode);
  const store = tx.objectStore(STORE_NAME);

  return await callback(store);
}

/* ------------------------------------------------------------------ */
/* Store / load just the private key                                  */
/* ------------------------------------------------------------------ */

export async function storePrivateKey(privateKey: CryptoKey): Promise<void> {
  await withStore("readwrite", (store) => {
    return new Promise<void>((resolve, reject) => {
      const req = store.put(privateKey, "privateKey");

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });
}

export async function loadPrivateKey(): Promise<CryptoKey> {
  const privateKey = await withStore("readonly", (store) => {
    return new Promise<CryptoKey | undefined>((resolve, reject) => {
      const req = store.get("privateKey");

      req.onsuccess = () => resolve(req.result as CryptoKey | undefined);
      req.onerror = () => reject(req.error);
    });
  });

  if (!privateKey) {
    throw new Error("Private key not found");
  }

  return privateKey;
}

export async function hasStoredPrivateKey(): Promise<boolean> {
  try {
    await loadPrivateKey();
    return true;
  } catch {
    return false;
  }
}

export async function clearPrivateKey(): Promise<void> {
  await withStore("readwrite", (store) => {
    return new Promise<void>((resolve, reject) => {
      const req = store.delete("privateKey");

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });
}
