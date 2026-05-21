import { db, auth } from '@/lib/firebase';
import { 
  collection, addDoc, query, orderBy, getDocs, 
  doc, deleteDoc, updateDoc, serverTimestamp, where, onSnapshot, getDoc 
} from 'firebase/firestore';
import { notificationService } from './notificationService';

export interface ExpertQuestion {
  id?: string;
  userId: string;
  userName: string;
  expertId: string;
  expertName: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  createdAt: any;
  answeredAt?: any;
}

export const qaService = {
  /**
   * Submits a question to an expert.
   */
  askQuestion: async (expertId: string, expertName: string, question: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    // Fetch user profile for name
    const userSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
    const userData = userSnap.docs[0]?.data();

    const questionData: Omit<ExpertQuestion, 'id'> = {
      userId: user.uid,
      userName: userData?.fullName || 'User',
      expertId,
      expertName,
      question,
      status: 'pending',
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'expert_questions'), questionData);
    
    // Return with a real timestamp for immediate UI updates
    return { 
      id: docRef.id, 
      ...questionData,
      createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
    };
  },

  /**
   * Fetches questions sent by the user.
   */
  getUserQuestions: async (): Promise<ExpertQuestion[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, 'expert_questions'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ExpertQuestion[];
  },

  /**
   * Fetches questions sent to an expert.
   */
  getExpertQuestions: async (expertId: string): Promise<ExpertQuestion[]> => {
    const q = query(
      collection(db, 'expert_questions'), 
      where('expertId', '==', expertId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ExpertQuestion[];
  },

  /**
   * Expert replies to a question.
   */
  answerQuestion: async (questionId: string, answer: string) => {
    const questionRef = doc(db, 'expert_questions', questionId);
    const questionSnap = await getDoc(questionRef);
    const questionData = questionSnap.data();

    await updateDoc(questionRef, {
      answer,
      status: 'answered',
      answeredAt: serverTimestamp()
    });

    if (questionData) {
      await notificationService.triggerNotification(
        questionData.userId,
        'Expert Response Received',
        `Expert ${questionData.expertName} has responded to your clinical inquiry.`,
        'qa',
        '/qa'
      );
    }
  }
};
