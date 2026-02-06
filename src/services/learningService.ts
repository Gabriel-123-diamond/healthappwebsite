import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g., "5 min"
  type: 'video' | 'article' | 'quiz';
  isCompleted?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: 'Medical' | 'Herbal' | 'Lifestyle';
  icon: string; // Lucide icon name
  progress: number; // 0-100
  totalModules: number;
  modules: Module[];
}

const COLLECTION_NAME = 'learningPaths';

export async function getLearningPaths(): Promise<LearningPath[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LearningPath));
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return [];
  }
}

export async function getLearningPathById(id: string): Promise<LearningPath | undefined> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LearningPath;
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching learning path ${id}:`, error);
    return undefined;
  }
}
