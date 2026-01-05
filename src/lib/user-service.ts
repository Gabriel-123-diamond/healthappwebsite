import { db } from "./firebase";
import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp, where, Timestamp } from "firebase/firestore";

export interface SearchHistoryItem {
  id: string;
  query: string;
  mode: string;
  summary?: string;
  timestamp: any;
}

export interface SavedResource {
  id: string;
  title: string;
  link: string;
  snippet?: string;
  type?: string;
  timestamp: any;
}

export async function saveSearchHistory(userId: string, queryText: string, mode: string, summary?: string) {
  if (!userId || !queryText.trim()) return;

  try {
    const historyRef = collection(db, "users", userId, "search_history");
    await addDoc(historyRef, {
      query: queryText,
      mode: mode,
      summary: summary,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving history:", error);
  }
}

export async function getSearchHistory(userId: string, start?: Date, end?: Date): Promise<SearchHistoryItem[]> {
  if (!userId) return [];

  try {
    const historyRef = collection(db, "users", userId, "search_history");
    let q = query(historyRef, orderBy("timestamp", "desc"));

    if (start) {
      q = query(q, where("timestamp", ">=", Timestamp.fromDate(start)));
    }
    if (end) {
      q = query(q, where("timestamp", "<=", Timestamp.fromDate(end)));
    }
    
    if (!start && !end) {
        q = query(q, limit(20));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SearchHistoryItem));
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}

export async function saveResource(userId: string, resource: Omit<SavedResource, 'id' | 'timestamp'>) {
  if (!userId) return;
  try {
    await addDoc(collection(db, "users", userId, "saved_resources"), {
      ...resource,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving resource:", error);
  }
}

export async function getSavedResources(userId: string, start?: Date, end?: Date): Promise<SavedResource[]> {
  if (!userId) return [];
  try {
    const ref = collection(db, "users", userId, "saved_resources");
    let q = query(ref, orderBy("timestamp", "desc"));

    if (start) {
      q = query(q, where("timestamp", ">=", Timestamp.fromDate(start)));
    }
    if (end) {
      q = query(q, where("timestamp", "<=", Timestamp.fromDate(end)));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SavedResource));
  } catch (error) {
    console.error("Error fetching saved resources:", error);
    return [];
  }
}
