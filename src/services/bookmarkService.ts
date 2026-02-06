import { 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { getUserSubcollection, getUserSubdoc } from "@/lib/firestoreUtils";
import { storageUtils } from "@/lib/storageUtils";
import { FIRESTORE_COLLECTIONS, STORAGE_KEYS } from "@/lib/constants";

export interface SavedItem {
  id: string;
  title: string;
  excerpt: string;
  type: 'article' | 'video' | string;
  category: string;
  source: string;
  date: string;
  link: string;
  evidenceGrade?: string;
  imageUrl?: string;
}

export interface SavedSearch {
  id: string;
  query: string;
  mode: string;
  response: any;
  timestamp: any;
}

export const bookmarkService = {
  async saveSearchResponse(queryText: string, mode: string, response: any): Promise<void> {
    const searchId = `${queryText.toLowerCase()}_${mode}`;
    const searchData: SavedSearch = {
      id: searchId,
      query: queryText,
      mode,
      response,
      timestamp: new Date().toISOString()
    };

    storageUtils.updateList(STORAGE_KEYS.SAVED_SEARCHES, searchData);

    const searchRef = getUserSubdoc(FIRESTORE_COLLECTIONS.SAVED_SEARCHES, searchId);
    if (searchRef) await setDoc(searchRef, { ...searchData, timestamp: serverTimestamp() });
  },

  async removeSavedSearch(searchId: string): Promise<void> {
    storageUtils.removeFromList(STORAGE_KEYS.SAVED_SEARCHES, searchId);
    const searchRef = getUserSubdoc(FIRESTORE_COLLECTIONS.SAVED_SEARCHES, searchId);
    if (searchRef) await deleteDoc(searchRef);
  },

  async isSearchSaved(queryText: string, mode: string): Promise<boolean> {
    const searchId = `${queryText.toLowerCase()}_${mode}`;
    return !!storageUtils.get<SavedSearch[]>(STORAGE_KEYS.SAVED_SEARCHES)?.find(s => s.id === searchId);
  },

  async getSavedSearches(): Promise<SavedSearch[]> {
    return storageUtils.get<SavedSearch[]>(STORAGE_KEYS.SAVED_SEARCHES) || [];
  },

  async toggleBookmark(item: SavedItem): Promise<void> {
    const isBookmarked = await this.isBookmarked(item.id);
    if (isBookmarked) await this.removeBookmark(item.id);
    else await this.addBookmark(item);
  },

  async addBookmark(item: SavedItem): Promise<void> {
    storageUtils.updateList(STORAGE_KEYS.BOOKMARKS, item);
    const bookmarkRef = getUserSubdoc(FIRESTORE_COLLECTIONS.BOOKMARKS, item.id);
    if (bookmarkRef) await setDoc(bookmarkRef, { ...item, timestamp: serverTimestamp() });
  },

  async removeBookmark(id: string): Promise<void> {
    storageUtils.removeFromList(STORAGE_KEYS.BOOKMARKS, id);
    const bookmarkRef = getUserSubdoc(FIRESTORE_COLLECTIONS.BOOKMARKS, id);
    if (bookmarkRef) await deleteDoc(bookmarkRef);
  },

  async isBookmarked(id: string): Promise<boolean> {
    return !!storageUtils.get<SavedItem[]>(STORAGE_KEYS.BOOKMARKS)?.find(b => b.id === id);
  },

  async getBookmarkedItems(): Promise<SavedItem[]> {
    return storageUtils.get<SavedItem[]>(STORAGE_KEYS.BOOKMARKS) || [];
  },

  async syncBookmarks(): Promise<void> {
    const bookmarksRef = getUserSubcollection(FIRESTORE_COLLECTIONS.BOOKMARKS);
    const searchesRef = getUserSubcollection(FIRESTORE_COLLECTIONS.SAVED_SEARCHES);
    if (!bookmarksRef || !searchesRef) return;

    try {
      const [bSnap, sSnapshot] = await Promise.all([
        getDocs(query(bookmarksRef, orderBy('timestamp', 'desc'))),
        getDocs(query(searchesRef, orderBy('timestamp', 'desc')))
      ]);
      
      storageUtils.set(STORAGE_KEYS.BOOKMARKS, bSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      storageUtils.set(STORAGE_KEYS.SAVED_SEARCHES, sSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error syncing bookmarks:", error);
    }
  }
};