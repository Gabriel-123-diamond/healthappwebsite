import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { encryptionService } from "@/lib/encryption";

export interface JournalEntry {
  id?: string;
  userId: string;
  timestamp: Date;
  severity: number; // 1-10
  symptoms: string[];
  mood: string;
  notes: string;
}

const COLLECTION_NAME = "journals";

export const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
  // Encrypt sensitive data
  const encryptedNotes = await encryptionService.encrypt(entry.notes);
  const encryptedSymptoms = await encryptionService.encrypt(JSON.stringify(entry.symptoms));

  return await addDoc(collection(db, COLLECTION_NAME), {
    ...entry,
    notes: encryptedNotes,
    symptoms: encryptedSymptoms, // Stored as encrypted string, not array
    timestamp: Timestamp.now()
  });
};

export const getUserJournals = async (userId: string): Promise<JournalEntry[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("userId", "==", userId),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(q);
  
  const entries = await Promise.all(snapshot.docs.map(async (doc) => {
    const data = doc.data();
    
    // Decrypt
    let notes = data.notes;
    let symptoms = data.symptoms;

    try {
      notes = await encryptionService.decrypt(data.notes);
      
      // Handle legacy unencrypted array or new encrypted string
      if (typeof data.symptoms === 'string') {
        const decryptedSymptoms = await encryptionService.decrypt(data.symptoms);
        symptoms = JSON.parse(decryptedSymptoms);
      }
    } catch (e) {
      console.warn("Error decrypting journal entry:", e);
    }

    return {
      id: doc.id,
      ...data,
      notes,
      symptoms,
      timestamp: (data.timestamp as Timestamp).toDate()
    } as JournalEntry;
  }));

  return entries;
};

export const deleteJournalEntry = async (entryId: string) => {
  return await deleteDoc(doc(db, COLLECTION_NAME, entryId));
};