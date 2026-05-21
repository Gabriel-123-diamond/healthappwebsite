import { db, auth } from "@/lib/firebase";
import { 
  collection, getDocs, doc, query, where, 
  serverTimestamp, Timestamp, addDoc, limit, deleteDoc, updateDoc, increment,
  onSnapshot
} from "firebase/firestore";

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

const ACCESS_CODES_COLLECTION = 'access_codes';

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

export function subscribeToExpertAccessCodes(expertId: string, callback: (codes: AccessCode[]) => void): () => void {
  const q = query(
    collection(db, ACCESS_CODES_COLLECTION),
    where('expertId', '==', expertId)
  );

  return onSnapshot(q, (snapshot) => {
    const codes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        expiresAt: data.expiresAt?.toDate?.() || new Date()
      } as AccessCode;
    });
    
    // Sort manually by createdAt desc
    const sortedCodes = codes.sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
      return timeB - timeA;
    });

    callback(sortedCodes);
  }, (error) => {
    console.error("Error subscribing to access codes:", error);
  });
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

export async function verifyAccessCode(code: string): Promise<any | null> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Authentication required");

    const token = await currentUser.getIdToken();
    const response = await fetch('/api/expert/access-code/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) return null;
      if (errorData.error === 'expired') throw new Error("expired");
      if (errorData.error === 'limit-reached') throw new Error("limit-reached");
      if (response.status === 429) throw new Error("rate-limit");
      throw new Error(errorData.error || "Verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying access code:", error);
    throw error;
  }
}
