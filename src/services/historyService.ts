import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { SearchHistoryItem } from '@/types/history';

export async function getSearchHistory(userId: string, start?: Date, end?: Date): Promise<SearchHistoryItem[]> {
  try {
    const historyRef = collection(db, 'users', userId, 'searchHistory');
    let q = query(historyRef, orderBy('timestamp', 'desc'));

    if (start) {
      q = query(q, where('timestamp', '>=', Timestamp.fromDate(start)));
    }
    if (end) {
      q = query(q, where('timestamp', '<=', Timestamp.fromDate(end)));
    }

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        query: data.query,
        mode: data.mode,
        summary: data.summary,
        timestamp: (data.timestamp as Timestamp).toDate(),
      } as SearchHistoryItem;
    });
  } catch (error) {
    console.error("Error fetching search history:", error);
    return [];
  }
}
