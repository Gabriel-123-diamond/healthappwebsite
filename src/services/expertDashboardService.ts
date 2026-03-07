import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, where, orderBy, serverTimestamp, Timestamp, addDoc, limit } from "firebase/firestore";

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

export interface AccessCode {
  id: string;
  code: string;
  expertId: string;
  expertName: string;
  createdAt: any;
  expiresAt: any;
}

const STATS_COLLECTION = 'expert_stats';
const CONTENT_COLLECTION = 'expert_content';
const ACCESS_CODES_COLLECTION = 'access_codes';

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

export async function generateAccessCode(expertId: string, expertName: string, expiryHours: number = 24): Promise<AccessCode> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const createdAt = serverTimestamp();
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + expiryHours * 60 * 60 * 1000));

  const docRef = await addDoc(collection(db, ACCESS_CODES_COLLECTION), {
    code,
    expertId,
    expertName,
    createdAt,
    expiresAt
  });

  return {
    id: docRef.id,
    code,
    expertId,
    expertName,
    createdAt: new Date(),
    expiresAt: expiresAt.toDate()
  };
}

export async function getActiveAccessCode(expertId: string): Promise<AccessCode | null> {
  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, ACCESS_CODES_COLLECTION),
      where('expertId', '==', expertId),
      where('expiresAt', '>', now),
      orderBy('expiresAt', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const data = snapshot.docs[0].data();
    return {
      id: snapshot.docs[0].id,
      ...data
    } as AccessCode;
  } catch (error) {
    console.error("Error fetching active access code:", error);
    return null;
  }
}

export async function verifyAccessCode(code: string): Promise<AccessCode | null> {
  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, ACCESS_CODES_COLLECTION),
      where('code', '==', code),
      where('expiresAt', '>', now),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const data = snapshot.docs[0].data();
    return {
      id: snapshot.docs[0].id,
      ...data
    } as AccessCode;
  } catch (error) {
    console.error("Error verifying access code:", error);
    return null;
  }
}
