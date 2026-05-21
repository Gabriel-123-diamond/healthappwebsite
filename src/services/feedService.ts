import { db, auth, appCheck } from '@/lib/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '@/lib/constants';
import { getToken } from 'firebase/app-check';

export interface FeedItem {
  id: string;
  title: string;
  excerpt: string;
  type: 'article' | 'video';
  category: 'Medical' | 'Herbal' | 'Lifestyle';
  imageUrl?: string;
  source: string;
  date: string;
  isVerified: boolean;
  link: string;
  evidenceGrade: 'A' | 'B' | 'C' | 'D';
}

export async function getFeedItems(locale: string = 'en'): Promise<FeedItem[]> {
  try {
    // Defensive check: Ensure App Check token is available if enforced
    if (typeof window !== 'undefined' && appCheck) {
      try {
        await getToken(appCheck);
      } catch (tokenErr) {
        console.warn("App Check token acquisition failed, proceeding anyway:", tokenErr);
      }
    }

    const feedRef = collection(db, FIRESTORE_COLLECTIONS.FEED_ITEMS);
    
    // Simplified query to avoid index requirements
    const q = query(feedRef, limit(10));
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.warn(`No feed items found in Firestore collection '${FIRESTORE_COLLECTIONS.FEED_ITEMS}'.`);
      return [];
    }

    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FeedItem));

    // Client-side filtering
    return items.filter(item => 
      (item as any).language === locale || (item as any).language === 'en'
    );
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      const user = auth.currentUser;
      console.error(
        `CRITICAL: Firestore Permission Denied for collection '${FIRESTORE_COLLECTIONS.FEED_ITEMS}'.\n` +
        `Current user: ${user ? user.uid : 'Anonymous'}\n` +
        `Is Anonymous: ${user ? user.isAnonymous : 'N/A'}\n` +
        `Auth state: ${user ? 'Authenticated' : 'Not Authenticated'}\n` +
        `Hint: Check App Check debug token in Chrome console and Firestore rules.`
      );
    } else {
      console.error("CRITICAL: Error in getFeedItems:", error);
    }
    throw error;
  }
}