// Mocked Web Crypto API wrapper for E2EE (Phase 12)

export async function generateKeyPair() {
  if (typeof window === 'undefined') return null;
  return window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(publicKey: CryptoKey, message: string) {
  const enc = new TextEncoder();
  const encoded = enc.encode(message);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    encoded
  );
  return Buffer.from(encrypted).toString('base64');
}

export async function decryptMessage(privateKey: CryptoKey, encryptedBase64: string) {
  const encryptedBuf = Buffer.from(encryptedBase64, 'base64');
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedBuf
  );
  const dec = new TextDecoder();
  return dec.decode(decrypted);
}
