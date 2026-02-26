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
