import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, where, orderBy } from "firebase/firestore";

export interface ExpertStats {
  totalViews: number;
  questionsAnswered: number;
  articlesPublished: number;
  rating: number;
}

export interface ExpertContent {
  id: string;
  title: string;
  type: 'Article' | 'Video';
  status: 'Published' | 'Draft' | 'Under Review';
  views: number;
  date: string;
}

const STATS_COLLECTION = 'expert_stats';
const CONTENT_COLLECTION = 'expert_content';

export async function getExpertStats(expertId: string): Promise<ExpertStats> {
  if (!expertId) {
    return { totalViews: 0, questionsAnswered: 0, articlesPublished: 0, rating: 0 };
  }
  try {
    const docRef = doc(db, STATS_COLLECTION, expertId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as ExpertStats;
    }
    // Return empty/zero stats if not found
    return { totalViews: 0, questionsAnswered: 0, articlesPublished: 0, rating: 0 };
  } catch (error) {
    console.error("Error fetching expert stats:", error);
    return { totalViews: 0, questionsAnswered: 0, articlesPublished: 0, rating: 0 };
  }
}

export async function getExpertContent(expertId: string): Promise<ExpertContent[]> {
  if (!expertId) return [];
  try {
    const q = query(
      collection(db, CONTENT_COLLECTION),
      where('expertId', '==', expertId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ExpertContent));
  } catch (error) {
    console.error("Error fetching expert content:", error);
    return [];
  }
}
