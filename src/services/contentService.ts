import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { Article } from '@/types/article';
import { LearningPath } from '@/types/learning';

export const contentService = {
  // --- Articles ---
  
  createArticle: async (articleData: Omit<Article, 'id'>) => {
    const docRef = await addDoc(collection(db, 'articles'), {
      ...articleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  updateArticle: async (id: string, articleData: Partial<Article>) => {
    const docRef = doc(db, 'articles', id);
    await updateDoc(docRef, {
      ...articleData,
      updatedAt: serverTimestamp(),
    });
  },

  getExpertArticles: async (expertId: string) => {
    const q = query(collection(db, 'articles'), where('authorId', '==', expertId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
  },

  deleteArticle: async (id: string) => {
    await deleteDoc(doc(db, 'articles', id));
  },

  // --- Learning Paths (Courses) ---

  createLearningPath: async (pathData: Omit<LearningPath, 'id'>) => {
    const docRef = await addDoc(collection(db, 'learning_paths'), {
      ...pathData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  updateLearningPath: async (id: string, pathData: Partial<LearningPath>) => {
    const docRef = doc(db, 'learning_paths', id);
    await updateDoc(docRef, {
      ...pathData,
      updatedAt: serverTimestamp(),
    });
  },

  getExpertLearningPaths: async (expertId: string) => {
    const q = query(collection(db, 'learning_paths'), where('authorId', '==', expertId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LearningPath));
  },

  deleteLearningPath: async (id: string) => {
    await deleteDoc(doc(db, 'learning_paths', id));
  }
};
