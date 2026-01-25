import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, deleteDoc, doc } from "firebase/firestore";

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
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...entry,
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
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: (doc.data().timestamp as Timestamp).toDate()
  })) as JournalEntry[];
};

export const deleteJournalEntry = async (entryId: string) => {
  return await deleteDoc(doc(db, COLLECTION_NAME, entryId));
};
