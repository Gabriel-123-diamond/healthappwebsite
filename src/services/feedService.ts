import { db } from '@/lib/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '@/lib/constants';

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
  } catch (error) {
    console.error("CRITICAL: Firestore Permission Error in getFeedItems. Ensure rules are deployed.", error);
    throw error;
  }
}