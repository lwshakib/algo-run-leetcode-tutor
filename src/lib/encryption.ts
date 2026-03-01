/**
 * Secure encryption utility using the Web Crypto API (AES-GCM).
 * This utility is used to protect sensitive data like API keys before storing them in local storage.
 * The secret key is derived from a VITE_ENCRYPTION_SECRET environment variable.
 */

// Load the secret from environment variables or use a hardcoded fallback (for development only)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_SECRET || 'fallback-secret-key-12345';

/**
 * Converts a regular string into a Uint8Array buffer.
 */
const strToBuffer = (str: string) => new TextEncoder().encode(str);

/**
 * Converts an ArrayBuffer into a Base64-encoded string for easy storage and transmission.
 */
const bufferToBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * Converts a Base64-encoded string back into an ArrayBuffer.
 */
const base64ToBuffer = (base64: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Derives a cryptographic key for AES-GCM from the provided SECRET_KEY.
 * It uses SHA-256 to hash the secret to ensure it has the required length.
 */
const getCryptoKey = async () => {
  const keyData = strToBuffer(SECRET_KEY);
  // Create a 32-byte hash (SHA-256) of the secret string
  const hash = await crypto.subtle.digest('SHA-256', keyData);
  // Import the hash as a raw key for use with AES-GCM
  return await crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
};

/**
 * Encrypts a plaintext string using AES-GCM.
 * It generates a random IV (Initialization Vector) for each encryption operation.
 * The output is a Base64 string containing [IV + Ciphertext].
 */
export const encrypt = async (text: string): Promise<string> => {
  try {
    const key = await getCryptoKey();
    // Generate a unique 12-byte IV for this encryption
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = strToBuffer(text);

    // Perform the encryption
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

    // Prefix the encrypted data with the IV so it can be retrieved during decryption
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return bufferToBase64(combined.buffer);
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
};

/**
 * Decrypts a Base64-encoded string previously encrypted using the 'encrypt' function.
 * It extracts the IV from the first 12 bytes and uses it to decrypt the remaining ciphertext.
 */
export const decrypt = async (encoded: string): Promise<string> => {
  try {
    const key = await getCryptoKey();
    const combined = new Uint8Array(base64ToBuffer(encoded));

    // The first 12 bytes are the IV
    const iv = combined.slice(0, 12);
    // The rest is the actual encrypted content
    const data = combined.slice(12);

    // Perform the decryption
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);

    // Transform the buffer back into a UTF-8 string
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return ''; // Return an empty string on failure
  }
};
