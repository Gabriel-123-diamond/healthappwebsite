import { query, where, orderBy, getDocs, Timestamp, setDoc, getDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { SearchHistoryItem } from '@/types/history';
import { AIResponse } from './aiService';
import { getUserSubcollection, getUserSubdoc } from '@/lib/firestoreUtils';
import { FIRESTORE_COLLECTIONS, STORAGE_KEYS } from '@/lib/constants';
import { storageUtils } from '@/lib/storageUtils';

export async function clearSearchHistory() {
  const historyRef = getUserSubcollection(FIRESTORE_COLLECTIONS.HISTORY);
  if (!historyRef) return;

  try {
    // 1. Clear Local (both session and local for safety)
    if (typeof window !== 'undefined') {
      [sessionStorage, localStorage].forEach(storage => {
        const keys = Object.keys(storage);
        keys.forEach(key => {
          if (key.startsWith(STORAGE_KEYS.SEARCH_HISTORY_PREFIX)) {
            storage.removeItem(key);
          }
        });
      });
    }

    // 2. Clear Firestore
    const snapshot = await getDocs(historyRef);
    const batch = writeBatch(historyRef.firestore);
    snapshot.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    console.error("Error clearing search history:", error);
    throw error;
  }
}

export async function saveSearch(queryText: string, mode: string, response: AIResponse) {
  const cacheKey = `${queryText.toLowerCase()}_${mode}`;
  
  // Save sensitive health response to sessionStorage for privacy
  storageUtils.set(STORAGE_KEYS.SEARCH_HISTORY_PREFIX + cacheKey, {
    response,
    timestamp: new Date().toISOString()
  }, true);

  const historyRef = getUserSubdoc(FIRESTORE_COLLECTIONS.HISTORY, cacheKey);
  if (historyRef) {
    try {
      await setDoc(historyRef, {
        query: queryText,
        mode,
        response,
        summary: response.answer.substring(0, 150) + '...',
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  }
}

export async function getCachedSearch(queryText: string, mode: string): Promise<AIResponse | null> {
  const cacheKey = `${queryText.toLowerCase()}_${mode}`;
  
  // Try sessionStorage first (private session cache)
  const local = storageUtils.get<{ response: AIResponse }>(STORAGE_KEYS.SEARCH_HISTORY_PREFIX + cacheKey, true);
  if (local) return local.response;

  const historyRef = getUserSubdoc(FIRESTORE_COLLECTIONS.HISTORY, cacheKey);
  if (historyRef) {
    try {
      const docSnap = await getDoc(historyRef);
      if (docSnap.exists()) return docSnap.data().response as AIResponse;
    } catch (error) {
      console.error("Error fetching cached search:", error);
    }
  }
  return null;
}

export async function getSearchHistory(userId: string, start?: Date, end?: Date): Promise<SearchHistoryItem[]> {
  try {
    const historyRef = getUserSubcollection(FIRESTORE_COLLECTIONS.HISTORY);
    if (!historyRef) return [];

    let q = query(historyRef, orderBy('timestamp', 'desc'));
    if (start) q = query(q, where('timestamp', '>=', Timestamp.fromDate(start)));
    if (end) q = query(q, where('timestamp', '<=', Timestamp.fromDate(end)));

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
