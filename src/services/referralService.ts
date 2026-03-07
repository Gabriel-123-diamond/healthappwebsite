import { db, auth } from '@/lib/firebase';
import { 
  collection, query, where, doc, 
  getDoc, onSnapshot, QuerySnapshot, DocumentData, getDocs 
} from 'firebase/firestore';

// Default points, but this will be updated by fetching from the server config API.
export let REWARD_POINTS = 150;

// Internal function to sync configuration from server
const syncConfig = async () => {
  try {
    const response = await fetch('/api/referral/points');
    if (response.ok) {
      const data = await response.json();
      REWARD_POINTS = data.points;
    }
  } catch (e) {
    console.error("Failed to sync reward configuration:", e);
  }
};

// Start initial sync
if (typeof window !== 'undefined') {
  syncConfig();
}

export const referralService = {
  generateReferralCode: async (_uid: string, username: string): Promise<string> => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Unauthorized");

      const token = await user.getIdToken();
      const response = await fetch('/api/referral/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
      });

      if (!response.ok) throw new Error('Failed to generate code');
      const data = await response.json();
      return data.code;
    } catch (e) {
      console.error('Error generating referral code:', e);
      throw e;
    }
  },

  getReferralLink: (code: string): string => {
    if (typeof window === 'undefined') return '';
    const baseUrl = window.location.origin;
    // Redirect to sign-up page so new users can register with the code auto-filled
    return `${baseUrl}/auth/signup?ref=${code}`;
  },

  getExistingReferralCode: async (uid: string): Promise<string | null> => {
    const docSnap = await getDoc(doc(db, 'referral_codes', uid));
    if (docSnap.exists()) {
      return docSnap.data().code as string;
    }
    return null;
  },

  validateReferralCode: async (code: string): Promise<string | null> => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) return null;

    // Validation still happens via public query for performance, 
    // but creation and modification are restricted.
    const q = query(collection(db, 'referral_codes'), where('code', '==', normalizedCode));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].data().ownerUid as string;
    }
    return null;
  },

  applyReferralCode: async (code: string, referrerUid: string, _inviteeUid: string, _inviteeEmail: string | null): Promise<void> => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('/api/referral/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, referrerUid })
      });

      if (!response.ok) throw new Error('Failed to apply referral');
    } catch (e) {
      console.error('Error applying referral code:', e);
    }
  },

  completeReferral: async (_inviteeUid: string): Promise<void> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const response = await fetch('/api/referral/complete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to complete referral securely');
      }
    } catch (e) {
      console.error('Error completing referral:', e);
    }
  },

  getReferralTracker: (uid: string, callback: (snapshot: QuerySnapshot<DocumentData>) => void, onError?: (error: unknown) => void) => {
    try {
      const q = query(
        collection(db, 'referrals'),
        where('referrerUid', '==', uid)
      );
      return onSnapshot(q, {
        next: (snapshot) => callback(snapshot),
        error: (error) => {
          console.error('Error in getReferralTracker snapshot:', error);
          if (onError) onError(error);
        }
      });
    } catch (e) {
      console.error('Error getting referral tracker:', e);
      if (onError) onError(e);
      return () => {};
    }
  },

  calculateReferralPoints: (referrals: { status: string }[]): number => {
    return referrals.filter(r => r.status === 'completed').length * REWARD_POINTS;
  }
};
