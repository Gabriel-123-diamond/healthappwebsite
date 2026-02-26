import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, Timestamp, limit, updateDoc, doc } from 'firebase/firestore';
import { AIReview } from '@/types';

export type { AIReview };

export interface PendingReview {
  queryId: string;
  query: string;
  mode: string;
  answer: string;
  timestamp: Date;
}

const COLLECTION_NAME = 'reviews';
const GLOBAL_HISTORY = 'global_history';

export const reviewService = {
  async getReviewsForQuery(queryText: string, mode: string): Promise<AIReview[]> {
    const queryId = `${queryText.toLowerCase()}_${mode}`;
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('queryId', '==', queryId),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: (data.timestamp as Timestamp).toDate()
        } as AIReview;
      });
    } catch (error) {
      console.error("Error fetching expert reviews:", error);
      return [];
    }
  },

  async getPendingReviews(): Promise<PendingReview[]> {
    try {
      const q = query(
        collection(db, GLOBAL_HISTORY),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id, // For backward compatibility if needed
          queryId: doc.id,
          query: data.query,
          mode: data.mode,
          answer: data.answer,
          timestamp: (data.timestamp as Timestamp).toDate()
        } as any;
      });
    } catch (error) {
      console.error("Error fetching pending reviews:", error);
      return [];
    }
  },

  async submitReview(review: Omit<AIReview, 'id' | 'timestamp'>): Promise<void> {
    try {
      await addDoc(collection(db, COLLECTION_NAME), {
        ...review,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error submitting expert review:", error);
      throw error;
    }
  },

  async updateReviewStatus(reviewId: string, status: string, expertId: string, note: string, updatedAnswer?: string) {
    try {
      // Create new review record
      await addDoc(collection(db, COLLECTION_NAME), {
        queryId: reviewId, // The ID of the global history record
        status,
        expertId,
        note,
        updatedAnswer,
        timestamp: serverTimestamp(),
        expertName: "Verified Expert", // This would ideally be fetched from the profile
        expertTitle: "Specialist"
      });
    } catch (error) {
      console.error("Error updating review status:", error);
      throw error;
    }
  }
};
