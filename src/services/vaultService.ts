import { db, auth, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, query, orderBy, getDocs, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

const getEncryptionKey = (uid: string) => {
  return (process.env.NEXT_PUBLIC_VAULT_KEY || 'hc-medical-vault-secret') + '_' + uid;
};
const LEGACY_KEY = process.env.NEXT_PUBLIC_VAULT_KEY || 'default-secure-key-health-app-256';

const readAsDataURL = (file: File): Promise<string> => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result as string);
  reader.readAsDataURL(file);
});

export interface MedicalRecord {
  id?: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: any;
  category: 'report' | 'prescription' | 'scan' | 'other';
  isEncrypted?: boolean;
}

export const vaultService = {
  /**
   * Uploads a medical record to the vault.
   */
  uploadRecord: async (file: File, category: MedicalRecord['category']): Promise<MedicalRecord> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");
    
    // Phase 14: Client-side storage protection (20MB)
    if (file.size > 20 * 1024 * 1024) {
      throw new Error("File exceeds the maximum limit of 20MB.");
    }

    const timestamp = Date.now();
    
    // Encrypt file content
    const dataUrl = await readAsDataURL(file);
    const dynamicKey = getEncryptionKey(user.uid);
    const encryptedText = CryptoJS.AES.encrypt(dataUrl, dynamicKey).toString();
    const encryptedBlob = new Blob([encryptedText], { type: 'text/plain' });
    const encryptedFile = new File([encryptedBlob], `${file.name}.enc`);

    const storageRef = ref(storage, `vault/${user.uid}/${timestamp}_${file.name}.enc`);
    
    // 1. Upload to Storage
    await uploadBytes(storageRef, encryptedFile);
    const url = await getDownloadURL(storageRef);

    // 2. Save metadata to Firestore
    const recordData: Omit<MedicalRecord, 'id'> = {
      name: file.name,
      type: file.type,
      url: url,
      size: file.size,
      uploadedAt: serverTimestamp(),
      category,
      isEncrypted: true
    };

    const docRef = await addDoc(collection(db, 'users', user.uid, 'vault'), recordData);
    return { id: docRef.id, ...recordData } as MedicalRecord;
  },

  /**
   * Downloads and decrypts a record securely on the client.
   */
  downloadAndDecryptRecord: async (record: MedicalRecord) => {
    if (!record.isEncrypted) {
      window.open(record.url, '_blank');
      return;
    }

    try {
      const response = await fetch(record.url);
      const encryptedText = await response.text();
      
      let decryptedDataUrl = '';
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("Authentication required for decryption");
        decryptedDataUrl = CryptoJS.AES.decrypt(encryptedText, getEncryptionKey(user.uid)).toString(CryptoJS.enc.Utf8);
        if (!decryptedDataUrl) throw new Error("Fallback required");
      } catch (e) {
        // Fallback to legacy global key for older test records
        decryptedDataUrl = CryptoJS.AES.decrypt(encryptedText, LEGACY_KEY).toString(CryptoJS.enc.Utf8);
      }

      const a = document.createElement('a');
      a.href = decryptedDataUrl;
      a.download = record.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error("Decryption failed:", e);
      alert("Failed to decrypt secure vault document.");
    }
  },

  /**
   * Lists all records in the user's vault.
   */
  getRecords: async (targetUserId?: string): Promise<MedicalRecord[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const uid = targetUserId || user.uid;
    const vaultRef = collection(db, 'users', uid, 'vault');
    const q = query(vaultRef, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MedicalRecord[];
  },

  /**
   * Deletes a record from the vault.
   */
  deleteRecord: async (recordId: string, storageUrl: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    // 1. Delete from Storage
    const storageRef = ref(storage, storageUrl);
    await deleteObject(storageRef);

    // 2. Delete from Firestore
    await deleteDoc(doc(db, 'users', user.uid, 'vault', recordId));
  }
};
