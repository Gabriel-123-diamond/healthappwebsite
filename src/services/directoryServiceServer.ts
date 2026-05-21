import { adminDb } from "@/lib/firebaseAdmin";

export interface Expert {
  id: string;
  name: string;
  type: 'doctor' | 'wellness_practitioner' | 'hospital';
  specialty: string;
  location: string;
  rating: number;
  verified: boolean;
  imageUrl?: string;
}

const EXPERTS_COLLECTION = 'experts';

export const getExpertByIdServer = async (id: string): Promise<Expert | undefined> => {
  console.log(`[Server] Request to fetch expert: ${id}`);
  
  if (!adminDb) {
    console.error("[Server CRITICAL] adminDb is not initialized. SSR requests will crash without database.");
    return undefined;
  }

  try {
    const docRef = adminDb.collection(EXPERTS_COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as Expert;
    } else {
      console.warn(`[Server] Expert ${id} not found in Firestore.`);
      return undefined;
    }
  } catch (error: any) {
    console.error(`[Server] Firestore error for ID ${id}:`, error.message);
    return undefined;
  }
};
