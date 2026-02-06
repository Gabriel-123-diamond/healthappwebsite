import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, setDoc, serverTimestamp, updateDoc, writeBatch, getDoc, orderBy, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

export const REWARD_POINTS = parseInt(process.env.NEXT_PUBLIC_REWARD_POINTS || '50', 10);

export const referralService = {
  generateReferralCode: async (uid: string, username: string): Promise<string> => {
    // Strip everything except letters and numbers for the code prefix
    const cleanUsername = username.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    const generateCode = () => {
      let suffix = '';
      for (let i = 0; i < 4; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `${cleanUsername || 'REF'}-${suffix}`;
    };

    let isUnique = false;
    let code = '';

    // Try up to 5 times to generate a unique code
    for (let i = 0; i < 5; i++) {
      code = generateCode();
      const q = query(collection(db, 'referral_codes'), where('code', '==', code));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        isUnique = true;
        break;
      }
    }

    if (!isUnique) {
      code = `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    }

    await setDoc(doc(db, 'referral_codes', uid), {
      code,
      ownerUid: uid,
      ownerUsername: username,
      createdAt: serverTimestamp(),
    });
    
    return code;
  },

  getReferralLink: (code: string): string => {
    if (typeof window === 'undefined') return '';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    return `${baseUrl}/onboarding?ref=${code}`;
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

    const q = query(collection(db, 'referral_codes'), where('code', '==', normalizedCode));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].data().ownerUid as string;
    }
    return null;
  },

  applyReferralCode: async (code: string, referrerUid: string, inviteeUid: string, inviteeEmail: string | null): Promise<void> => {
    try {
      // Check if a referral already exists for this user
      const q = query(collection(db, 'referrals'), where('inviteeUid', '==', inviteeUid));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        console.log('Referral already exists for this user, skipping.');
        return;
      }

      await addDoc(collection(db, 'referrals'), {
        referrerUid,
        inviteeUid,
        inviteeEmail,
        code: code.trim().toUpperCase(),
        status: 'pending',
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error applying referral code:', e);
    }
  },

  completeReferral: async (inviteeUid: string): Promise<void> => {
    try {
      const q = query(
        collection(db, 'referrals'), 
        where('inviteeUid', '==', inviteeUid),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const referralDoc = snapshot.docs[0];
        const referrerUid = referralDoc.data().referrerUid;

        const batch = writeBatch(db);
        
        // Update referral status
        batch.update(referralDoc.ref, {
          status: 'completed',
          completedAt: serverTimestamp(),
        });

        // Award points to referrer and invitee
        // In a real app, these increments should happen via a transaction or Cloud Function
        // to avoid concurrency issues, but for this prototype we use batch.
        const referrerRef = doc(db, 'users', referrerUid);
        const inviteeRef = doc(db, 'users', inviteeUid);

        // We use set with merge: true to ensure the document exists
        // Note: FieldValue.increment(50) is the best way to handle this in Firestore
        const { increment } = await import('firebase/firestore');
        
        batch.set(referrerRef, { points: increment(REWARD_POINTS) }, { merge: true });
        batch.set(inviteeRef, { points: increment(REWARD_POINTS) }, { merge: true });

        await batch.commit();
      }
    } catch (e) {
      console.error('Error completing referral:', e);
    }
  },

  getReferralTracker: (uid: string, callback: (snapshot: QuerySnapshot<DocumentData>) => void, onError?: (error: any) => void) => {
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

  calculateReferralPoints: (referrals: any[]): number => {
    return referrals.filter(r => r.status === 'completed').length * REWARD_POINTS;
  }
};
