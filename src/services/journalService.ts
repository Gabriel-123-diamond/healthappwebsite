import { db, auth } from '@/lib/firebase';
import { 
  collection, addDoc, query, orderBy, getDocs, limit,
  doc, deleteDoc, updateDoc, serverTimestamp, where 
} from 'firebase/firestore';
import { cleanUndefined } from '@/lib/firestoreUtils';

export interface SymptomLog {
  id?: string;
  userId: string;
  symptoms: string[];
  severity: number;
  mood?: string;
  notes?: string;
  loggedAt: any;
}

export const journalService = {
  /**
   * Adds a new symptom log to the user's journal.
   */
  addLog: async (symptoms: string[], severity: number, notes?: string, mood?: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    const logData = cleanUndefined({
      userId: user.uid,
      symptoms,
      severity,
      mood,
      notes,
      loggedAt: serverTimestamp()
    });

    const docRef = await addDoc(collection(db, 'journals'), logData);
    
    // Return with a real timestamp for immediate UI updates to avoid "Invalid Date"
    return { 
      id: docRef.id, 
      ...logData,
      loggedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
    };
  },

  /**
   * Fetches the user's symptom history.
   */
  getLogs: async (): Promise<SymptomLog[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, 'journals'),
      where('userId', '==', user.uid),
      orderBy('loggedAt', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SymptomLog[];
  },

  /**
   * Deletes a specific symptom log.
   */
  deleteLog: async (id: string) => {
    await deleteDoc(doc(db, 'journals', id));
  }
};
