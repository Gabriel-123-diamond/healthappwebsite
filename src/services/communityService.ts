import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, orderBy, query } from 'firebase/firestore';

export interface Answer {
  id: string;
  authorName: string;
  authorRole: 'User' | 'Expert' | 'Moderator';
  content: string;
  timestamp: string;
  isVerifiedExpert: boolean;
  likes: number;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  authorName: string;
  category: 'General' | 'Medical' | 'Herbal' | 'Lifestyle';
  timestamp: string;
  likes: number;
  answerCount: number;
  tags: string[];
  answers: Answer[];
  isResolved: boolean;
}

const COLLECTION_NAME = 'questions';

export async function getQuestions(): Promise<Question[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));
  } catch (error) {
    console.error("Error fetching questions:", error);
    // Try without ordering if index is missing (common first run issue)
    try {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Question));
    } catch (e) {
        return [];
    }
  }
}

export async function getQuestionById(id: string): Promise<Question | undefined> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Question;
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching question ${id}:`, error);
    return undefined;
  }
}
