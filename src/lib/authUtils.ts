import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Determines the correct onboarding/home route for a user based on their profile status.
 */
export const getRedirectPath = async (uid: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const role = data?.role || 'user';
      
      if (role === 'admin') {
        return '/admin/dashboard';
      }
      
      if (role === 'hospital') {
        return data?.onboardingComplete === true ? '/hospital/dashboard' : '/hospital/setup';
      }
      
      if (role === 'doctor' || role === 'wellness_practitioner') {
        return data?.onboardingComplete === true ? '/expert/dashboard' : '/expert/setup';
      }

      // Standard user
      if (data?.onboardingComplete === true) {
        return '/';
      }
      return '/onboarding';
    }
    // New user with no document yet
    return '/onboarding';
  } catch (err) {
    console.error("Error determining redirect path:", err);
    return '/'; // Fallback to home
  }
};
