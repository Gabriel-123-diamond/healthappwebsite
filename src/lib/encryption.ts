// Simple client-side encryption utility
// NOTE: Key storage in localStorage is susceptible to XSS/physical access. 
// For production, use PBKDF2 with user password.

const KEY_STORAGE_KEY = 'user_encryption_key';

class EncryptionService {
  private key: CryptoKey | null = null;

  async init() {
    if (this.key) return;

    if (typeof window === 'undefined') return;

    let keyData = localStorage.getItem(KEY_STORAGE_KEY);

    if (!keyData) {
      // Generate new key
      const key = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );
      
      const exported = await window.crypto.subtle.exportKey("jwk", key);
      localStorage.setItem(KEY_STORAGE_KEY, JSON.stringify(exported));
      this.key = key;
    } else {
      // Load existing
      const jwk = JSON.parse(keyData);
      this.key = await window.crypto.subtle.importKey(
        "jwk",
        jwk,
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );
    }
  }

  async encrypt(plainText: string): Promise<string> {
    await this.init();
    if (!this.key) throw new Error("Encryption key not initialized");

    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // GCM standard IV

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      this.key,
      data
    );

    const encryptedArray = new Uint8Array(encrypted);
    
    // Combine IV and Ciphertext
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    // Convert to Base64
    return btoa(String.fromCharCode(...combined));
  }

  async decrypt(cipherText: string): Promise<string> {
    await this.init();
    if (!this.key) throw new Error("Encryption key not initialized");
    if (!cipherText) return "";

    try {
      const combined = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
      
      // Extract IV (12 bytes)
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        this.key,
        data
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (e) {
      console.error("Decryption failed:", e);
      // Fallback: return original text if not encrypted (migration path)
      return cipherText;
    }
  }
}

export const encryptionService = new EncryptionService();
