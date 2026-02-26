import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Institution } from '@/types/institution';

const INSTITUTIONS_COLLECTION = 'institutions';

export async function getInstitutionById(id: string): Promise<Institution | undefined> {
  try {
    const docRef = doc(db, INSTITUTIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Institution;
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching institution:", error);
    return undefined;
  }
}

export async function getInstitutions(): Promise<Institution[]> {
  try {
    const snapshot = await getDocs(collection(db, INSTITUTIONS_COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Institution));
  } catch (error) {
    console.error("Error fetching institutions:", error);
    return [];
  }
}