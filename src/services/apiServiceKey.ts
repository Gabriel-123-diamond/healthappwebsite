import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export interface APIKey {
  id: string;
  key: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  lastUsed?: Date;
}

const COLLECTION_NAME = 'api_keys';

export const apiKeyService = {
  async getMyKeys(): Promise<APIKey[]> {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('ownerId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as APIKey;
      });
    } catch (error) {
      console.error("Error fetching API keys:", error);
      return [];
    }
  },

  async generateKey(name: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in");

    // Simple random key generation
    const key = `ikike_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;

    try {
      await addDoc(collection(db, COLLECTION_NAME), {
        key,
        name,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error generating API key:", error);
      throw error;
    }
  },

  async deleteKey(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting API key:", error);
      throw error;
    }
  }
};
