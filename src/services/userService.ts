import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, deleteField } from 'firebase/firestore';
import { UserProfile } from '@/types';
import { userApiService } from './userApiService';

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
        onboardingStep: 4, 
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
   * Updates specific fields in the user's profile.
   */
  updateProfile: async (uid: string, data: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, 'users', uid);
      const { 
        role: _role, points: _points, emailVerified: _ev, phoneVerified: _pv, 
        verificationStatus: _vs, tier: _tier, onboardingComplete: _oc, 
        subscriptionExpiry: _se, vipTier: _vt, aiChatLimit: _acl, 
        aiChatUnlimited: _acu, vaultEnabled: _ve, familySlots: _fs, 
        requestedTier: _rt, isBanned: _ib,
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
   * Fetches the user's profile data.
   */
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        
        // Phase 19: Seamless KYC merge for authorized Web client
        const auth = (await import('@/lib/firebase')).auth;
        if (auth.currentUser?.uid === uid) {
          try {
            const { collection, getDoc: fetchSubDoc, doc: subdoc } = await import('firebase/firestore');
            const kycRef = subdoc(collection(userRef, 'private_kyc'), 'document');
            const kycSnap = await fetchSubDoc(kycRef);
            if (kycSnap.exists() && data.expertProfile) {
              const kycData = kycSnap.data();
              (data.expertProfile as any).kyc = kycData.kyc;
              (data.expertProfile as any).license = kycData.license;
            }
          } catch(e) {
             console.log("Private KYC skipped", e);
          }
        }
        
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Bridge to API service
  checkAvailability: userApiService.checkAvailability,
  isPhoneTaken: async (phone: string) => !(await userApiService.checkAvailability('phone', phone)),
  getAdmins: userApiService.getAdmins,
  getPendingExperts: userApiService.getPendingExperts,
  getVerifiedExperts: userApiService.getVerifiedExperts,
  getTierUpgrades: userApiService.getTierUpgrades,
  submitExpertProfile: userApiService.submitExpertProfile,
  completeOnboarding: userApiService.completeOnboarding,
  upgradeTier: userApiService.upgradeTier,
  verifyEmail: userApiService.verifyEmail,
  verifyPhone: userApiService.verifyPhone,
  syncVerificationStatus: userApiService.syncVerificationStatus,
};
