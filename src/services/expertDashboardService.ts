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

// In a real app, you'd get the expert ID from the auth context. 
// For this migration, I'll default to '1' (Dr. Sarah Johnson) if not passed, or just assume '1'.
const DEFAULT_EXPERT_ID = '1'; 

export async function getExpertStats(): Promise<ExpertStats> {
  try {
    const docRef = doc(db, STATS_COLLECTION, DEFAULT_EXPERT_ID);
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

export async function getExpertContent(): Promise<ExpertContent[]> {
  try {
    // Assuming we want content for the specific expert
    const q = query(
      collection(db, CONTENT_COLLECTION),
      where('expertId', '==', DEFAULT_EXPERT_ID)
      // orderBy('date', 'desc') // Requires index
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
