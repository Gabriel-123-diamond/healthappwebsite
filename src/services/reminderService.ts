import { db, auth } from '@/lib/firebase';
import { 
  collection, addDoc, query, orderBy, getDocs, 
  doc, deleteDoc, updateDoc, serverTimestamp, where, onSnapshot 
} from 'firebase/firestore';
import { cleanUndefined } from '@/lib/firestoreUtils';

export interface MedicationReminder {
  id?: string;
  userId: string;
  medicationName: string;
  dosage: string;
  frequency: string; // e.g., 'daily', 'twice_daily'
  times: string[];    // e.g., ['08:00', '20:00']
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: any;
}

export const reminderService = {
  /**
   * Adds a new medication reminder.
   */
  addReminder: async (data: Omit<MedicationReminder, 'id' | 'userId' | 'createdAt' | 'isActive'>) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    const reminderData = cleanUndefined({
      ...data,
      userId: user.uid,
      isActive: true,
      createdAt: serverTimestamp()
    });

    const docRef = await addDoc(collection(db, 'reminders'), reminderData);
    
    // Return with a real timestamp for immediate UI updates
    return { 
      id: docRef.id, 
      ...reminderData,
      createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
    };
  },

  /**
   * Fetches all active reminders for the current user.
   */
  getReminders: async (): Promise<MedicationReminder[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, 'reminders'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MedicationReminder[];
  },

  /**
   * Toggles the active status of a reminder.
   */
  toggleReminder: async (id: string, isActive: boolean) => {
    const reminderRef = doc(db, 'reminders', id);
    await updateDoc(reminderRef, { isActive });
  },

  /**
   * Deletes a reminder.
   */
  deleteReminder: async (id: string) => {
    await deleteDoc(doc(db, 'reminders', id));
  }
};
