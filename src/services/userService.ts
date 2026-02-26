import { db, auth } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, deleteField } from 'firebase/firestore';
import { UserProfile } from '@/types';

export const userService = {
  /**
   * Resets the onboarding progress and clears role-specific data.
   */
  resetOnboarding: async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        role: deleteField(),
        expertProfile: deleteField(),
        onboardingStep: 4, // Step 4 is Role Selection
        onboardingComplete: false,
        specialty: deleteField(),
        licenseNumber: deleteField(),
        institutionName: deleteField(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      throw error;
    }
  },

  /**
   * Checks if a phone number is already registered or verified by another user.
   */
  isPhoneTaken: async (fullPhoneNumber: string) => {
    try {
      // 1. Check primary phone field
      const q1 = query(collection(db, 'users'), where('phone', '==', fullPhoneNumber));
      const snap1 = await getDocs(q1);
      
      if (!snap1.empty) {
        const currentUid = auth.currentUser?.uid;
        if (!currentUid || snap1.docs.some(doc => doc.id !== currentUid)) {
          return true;
        }
      }

      // 2. Check within expert profile secondary phones
      // Note: Firestore array-contains-any or complex filters on objects in arrays are limited.
      // For a production app, we would use a dedicated 'verified_phones' collection.
      // For now, we'll check the primary field which is the most common case.
      
      return false;
    } catch (error) {
      console.error('Error checking phone uniqueness:', error);
      return false;
    }
  },

  /**
   * Checks if a specific field value is already taken by another user.
   */
  checkAvailability: async (field: 'username' | 'phone' | 'fullName', value: string) => {
    try {
      const q = query(collection(db, 'users'), where(field, '==', value));
      const snapshot = await getDocs(q);
      
      const currentUid = auth.currentUser?.uid;
      // If the only user with this value is the current user, it's considered available
      if (currentUid) {
        return snapshot.empty || snapshot.docs.every(doc => doc.id === currentUid);
      }
      return snapshot.empty;
    } catch (error) {
      console.error(`Error checking ${field} availability:`, error);
      return true; // Fallback to available to not block user on error
    }
  },

  /**
   * Updates specific fields in the user's profile.
   * @param uid The user's ID.
   * @param data The partial data to update.
   */
  updateProfile: async (uid: string, data: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Completes the expert profile setup.
   * @param uid The user's ID.
   * @param bio The expert's bio.
   * @param phoneNumber The expert's phone number.
   */
  completeExpertProfile: async (uid: string, bio: string, phoneNumber: string) => {
    return userService.updateProfile(uid, {
      bio,
      phone: phoneNumber,
      profileComplete: true,
      verificationStatus: 'pending',
    });
  },

  /**
   * Fetches pending experts for admin verification.
   */
  getPendingExperts: async (): Promise<UserProfile[]> => {
    try {
      const q = query(collection(db, 'users'), where('verificationStatus', '==', 'pending'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
    } catch (error) {
      console.error('Error fetching pending experts:', error);
      throw error;
    }
  },

  /**
   * Updates an expert's verification status.
   * DEPRECATED: Use /api/admin/expert/verify for server-side security.
   */

  /**
   * Fetches the user's profile data.
   * @param uid The user's ID.
   */
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
};
