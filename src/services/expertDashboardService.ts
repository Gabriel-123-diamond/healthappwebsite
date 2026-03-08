import { db } from "@/lib/firebase";
import { 
  collection, getDocs, doc, getDoc, query, where, orderBy, 
  serverTimestamp, Timestamp, addDoc, limit, deleteDoc, updateDoc, increment 
} from "firebase/firestore";

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
  usageCount: number;
  usageLimit: number; // 0 for unlimited
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

export async function generateAccessCode(expertId: string, expertName: string, expiryHours: number = 24, usageLimit: number = 0): Promise<AccessCode> {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const createdAt = serverTimestamp();
    const expiresAt = Timestamp.fromDate(new Date(Date.now() + expiryHours * 60 * 60 * 1000));

    const codeData = {
      code,
      expertId,
      expertName,
      usageCount: 0,
      usageLimit,
      createdAt,
      expiresAt
    };

    const docRef = await addDoc(collection(db, ACCESS_CODES_COLLECTION), codeData);

    return {
      ...codeData,
      id: docRef.id,
      createdAt: new Date(),
      expiresAt: expiresAt.toDate()
    } as AccessCode;
  } catch (error) {
    console.error("Error generating access code:", error);
    throw error;
  }
}

export async function getExpertAccessCodes(expertId: string): Promise<AccessCode[]> {
  try {
    const q = query(
      collection(db, ACCESS_CODES_COLLECTION),
      where('expertId', '==', expertId)
    );
    const snapshot = await getDocs(q);
    const codes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        expiresAt: data.expiresAt?.toDate?.() || new Date()
      } as AccessCode;
    });
    
    // Sort manually by createdAt desc to avoid requiring a composite index
    return codes.sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching access codes:", error);
    return [];
  }
}

export async function deleteAccessCode(codeId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ACCESS_CODES_COLLECTION, codeId));
  } catch (error) {
    console.error("Error deleting access code:", error);
    throw error;
  }
}

export async function incrementAccessCodeUsage(codeId: string): Promise<void> {
  try {
    await updateDoc(doc(db, ACCESS_CODES_COLLECTION, codeId), {
      usageCount: increment(1)
    });
  } catch (error) {
    console.error("Error incrementing access code usage:", error);
  }
}

export async function getActiveAccessCode(expertId: string): Promise<AccessCode | null> {
  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, ACCESS_CODES_COLLECTION),
      where('expertId', '==', expertId),
      where('expiresAt', '>', now)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    const codes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        expiresAt: data.expiresAt?.toDate?.() || new Date()
      } as AccessCode;
    });
    
    // Filter by usage limit and sort manually
    const validCodes = codes.filter(data => !(data.usageLimit > 0 && data.usageCount >= data.usageLimit));
    
    if (validCodes.length === 0) return null;

    return validCodes.sort((a, b) => b.expiresAt.getTime() - a.expiresAt.getTime())[0];
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
    
    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    
    // Check usage limit
    if (data.usageLimit > 0 && data.usageCount >= data.usageLimit) {
      return null;
    }

    return {
      ...data,
      id: docSnap.id
    } as AccessCode;
  } catch (error) {
    console.error("Error verifying access code:", error);
    return null;
  }
}
