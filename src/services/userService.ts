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
    return !(await userService.checkAvailability('phone', fullPhoneNumber));
  },

  /**
   * Checks if a specific field value is already taken by another user.
   */
  checkAvailability: async (field: 'username' | 'phone' | 'fullName' | 'licenseNumber' | 'email' | 'idNumber', value: string) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return true; // Default to available if not logged in
      
      const token = await currentUser.getIdToken();
      const response = await fetch('/api/user/check', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value })
      });

      if (!response.ok) {
        throw new Error('Failed to check availability');
      }

      const data = await response.json();
      return !data.taken; // return true if available (not taken)
    } catch (error) {
      console.error(`Error checking ${field} availability:`, error);
      return true; // Fallback to available to not block user on error
    }
  },

  /**
   * Updates specific fields in the user's profile.
   * NOTE: Fields like role, points, and verificationStatus are locked in Firestore rules 
   * and must be updated via secure server-side APIs.
   * @param uid The user's ID.
   * @param data The partial data to update.
   */
  updateProfile: async (uid: string, data: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, 'users', uid);
      
      // Clean restricted fields that must be updated via API
      const { 
        role: _role, points: _points, emailVerified: _ev, phoneVerified: _pv, 
        verificationStatus: _vs, tier: _tier, onboardingComplete: _oc, 
        ...cleanData 
      } = data as any;

      await setDoc(userRef, {
        ...cleanData,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
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
   * Securely submits an expert profile for verification via API.
   */
  submitExpertProfile: async (data: any) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const token = await currentUser.getIdToken();
      const response = await fetch('/api/expert/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to submit expert profile');
      return await response.json();
    } catch (error) {
      console.error('Error submitting expert profile:', error);
      throw error;
    }
  },

  /**
   * Securely completes onboarding via API.
   */
  completeOnboarding: async (formData: any) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const token = await currentUser.getIdToken();
      const response = await fetch('/api/user/onboarding/complete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to complete onboarding');
      return await response.json();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },

  /**
   * Securely upgrades user tier via API.
   */
  upgradeTier: async (tier: 'basic' | 'professional' | 'standard' | 'premium') => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const token = await currentUser.getIdToken();
      const response = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier })
      });

      if (!response.ok) throw new Error('Failed to upgrade tier');
      return await response.json();
    } catch (error) {
      console.error('Error upgrading tier:', error);
      throw error;
    }
  },

  /**
   * Securely verifies an email via OTP via API.
   */
  verifyEmail: async (email: string, otp: string) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const token = await currentUser.getIdToken();
      const response = await fetch('/api/user/verify-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp })
      });

      if (!response.ok) throw new Error('Failed to verify email');
      return await response.json();
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  },

  /**
   * Securely verifies a phone number via API.
   */
  verifyPhone: async (phone: string) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const token = await currentUser.getIdToken();
      const response = await fetch('/api/user/verify-phone', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone })
      });

      if (!response.ok) throw new Error('Failed to verify phone');
      return await response.json();
    } catch (error) {
      console.error('Error verifying phone:', error);
      throw error;
    }
  },

  /**
   * Syncs verification status from Auth to Firestore via secure API.
   */
  syncVerificationStatus: async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const token = await currentUser.getIdToken();
      const response = await fetch('/api/user/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to sync verification');
      return await response.json();
    } catch (error) {
      console.error('Error syncing verification:', error);
      throw error;
    }
  },

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
