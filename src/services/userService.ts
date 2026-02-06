import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  username?: string;
  points?: number;
  role?: string;
  onboardingComplete?: boolean;
  country?: string;
  city?: string;
  ageRange?: string;
  interests?: string[];
  onboardingStep?: number;
  createdAt?: any;
  updatedAt?: any;
}

export const userService = {
  /**
   * Fetches a user's profile from Firestore.
   */
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  /**
   * Creates a initial user profile.
   */
  createUserProfile: async (uid: string, data: Partial<UserProfile>): Promise<void> => {
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },

  /**
   * Updates a user's profile.
   */
  updateUserProfile: async (uid: string, data: Partial<UserProfile>): Promise<void> => {
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  /**
   * Checks if a specific field value is already taken (e.g. username).
   * Note: This assumes you have an API route or a client-side query method.
   * For client-side, we'd use a query. For now, we'll keep the API call pattern used in hooks
   * but encapsulate it here for cleaner component code.
   */
  checkAvailability: async (field: string, value: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/user/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value })
      });
      const data = await res.json();
      return !data.taken;
    } catch (error) {
      console.error(`Error checking ${field} availability:`, error);
      return false; // Fail safe
    }
  }
};
