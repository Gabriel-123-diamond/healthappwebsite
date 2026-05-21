import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Article } from '@/types/article';

const ARTICLES_COLLECTION = 'articles';

export async function getArticles(): Promise<Article[]> {
  try {
    const snapshot = await getDocs(collection(db, ARTICLES_COLLECTION));
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
  } catch (error) {
    console.error('Error fetching articles from Firestore:', error);
    return [];
  }
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Article;
    }
    
    return undefined;
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    return undefined;
  }
}
