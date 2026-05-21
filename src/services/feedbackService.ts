import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth } from '@/lib/firebase';

export interface FeedbackData {
  query: string;
  rating: number;
  tags: string[];
  comment: string;
}

export const feedbackService = {
  submitSearchFeedback: async (data: FeedbackData) => {
    const user = auth.currentUser;
    
    const feedbackData = {
      userId: user?.uid,
      userName: user?.email || 'Anonymous',
      ...data,
      timestamp: serverTimestamp(),
      platform: 'web'
    };

    // Save to general collection
    await addDoc(collection(db, 'search_feedback'), feedbackData);

    // Save to user subcollection if logged in
    if (user?.uid) {
      await addDoc(collection(db, `users/${user.uid}/polls`), feedbackData);
    }
  }
};
