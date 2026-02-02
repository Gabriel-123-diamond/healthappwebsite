import { adminDb } from "@/lib/firebaseAdmin";
import { MOCK_EXPERTS } from "@/data/mockExperts";

export interface Expert {
  id: string;
  name: string;
  type: 'doctor' | 'herbalist' | 'hospital';
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
    console.error("[Server] adminDb is not initialized!");
    return MOCK_EXPERTS.find(expert => expert.id === id) as Expert | undefined;
  }

  try {
    const docRef = adminDb.collection(EXPERTS_COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      console.log(`[Server] Successfully fetched from Firestore: ${id}`);
      return { id: docSnap.id, ...docSnap.data() } as Expert;
    } else {
      console.warn(`[Server] Expert ${id} not found in Firestore. Checking MOCK_EXPERTS...`);
      const mock = MOCK_EXPERTS.find(expert => expert.id === id) as Expert | undefined;
      if (mock) {
        console.log(`[Server] Found in MOCK_EXPERTS: ${id}`);
      } else {
        console.error(`[Server] Expert ${id} not found anywhere.`);
      }
      return mock;
    }
  } catch (error: any) {
    console.error(`[Server] Firestore error for ID ${id}:`, error.message);
    // Fallback to mock on error
    return MOCK_EXPERTS.find(expert => expert.id === id) as Expert | undefined;
  }
};
