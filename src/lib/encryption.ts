/**
 * Secure encryption utility using the Web Crypto API (AES-GCM).
 * The secret key is derived from the .env variable.
 */

const SECRET_KEY =
  import.meta.env.VITE_ENCRYPTION_SECRET || "fallback-secret-key-12345";

// Helper to convert string to ArrayBuffer
const strToBuffer = (str: string) => new TextEncoder().encode(str);

// Helper to convert ArrayBuffer to base64
const bufferToBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Helper to convert base64 to ArrayBuffer
const base64ToBuffer = (base64: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// Derive a cryptographic key from the secret string
const getCryptoKey = async () => {
  const keyData = strToBuffer(SECRET_KEY);
  // Hash the secret to ensure it's the correct length for AES-256 (32 bytes)
  const hash = await crypto.subtle.digest("SHA-256", keyData);
  return await crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
};

export const encrypt = async (text: string): Promise<string> => {
  try {
    const key = await getCryptoKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for GCM
    const data = strToBuffer(text);

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    // Combine IV and encrypted data: [iv (12) + ciphertext]
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return bufferToBase64(combined.buffer);
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
};

export const decrypt = async (encoded: string): Promise<string> => {
  try {
    const key = await getCryptoKey();
    const combined = new Uint8Array(base64ToBuffer(encoded));

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
};
