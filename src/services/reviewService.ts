import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  Timestamp,
  limit
} from "firebase/firestore";

export interface AIReview {
  id: string;
  query: string;
  answer: string;
  mode: 'medical' | 'herbal' | 'both';
  status: 'pending' | 'approved' | 'rejected' | 'edited';
  timestamp: Date;
  userId: string;
  expertComment?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

const COLLECTION_NAME = "reviews";

export const getPendingReviews = async (max: number = 20): Promise<AIReview[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("status", "==", "pending"),
    orderBy("timestamp", "asc"),
    limit(max)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: (doc.data().timestamp as Timestamp).toDate()
  })) as AIReview[];
};

export const updateReviewStatus = async (
  reviewId: string, 
  status: 'approved' | 'rejected' | 'edited', 
  expertId: string,
  comment?: string,
  updatedAnswer?: string
) => {
  const reviewRef = doc(db, COLLECTION_NAME, reviewId);
  const updateData: any = {
    status,
    reviewedBy: expertId,
    reviewedAt: Timestamp.now(),
    expertComment: comment || ""
  };

  if (updatedAnswer) {
    updateData.answer = updatedAnswer;
  }

  return await updateDoc(reviewRef, updateData);
};
