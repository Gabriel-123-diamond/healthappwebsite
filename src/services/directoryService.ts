import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc, setDoc, deleteDoc, orderBy, startAt, endAt } from "firebase/firestore";
import { geohashForLocation, geohashQueryBounds, distanceBetween } from "geofire-common";
import { MOCK_EXPERTS } from "@/data/mockExperts";
import { Expert } from "@/types/expert";

const EXPERTS_COLLECTION = 'experts';

export const seedExperts = async () => {
  const expertsRef = collection(db, EXPERTS_COLLECTION);
  const snapshot = await getDocs(expertsRef);
  
  if (!snapshot.empty) {
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }

  for (const expert of MOCK_EXPERTS) {
    const geohash = geohashForLocation([expert.lat, expert.lng]);
    await setDoc(doc(db, EXPERTS_COLLECTION, expert.id), {
      ...expert,
      geohash
    });
  }
};

export const getExpertsNearby = async (center: [number, number], radiusInM: number): Promise<Expert[]> => {
  const bounds = geohashQueryBounds(center, radiusInM);
  const promises = [];
  for (const b of bounds) {
    const q = query(
      collection(db, EXPERTS_COLLECTION),
      orderBy('geohash'),
      startAt(b[0]),
      endAt(b[1])
    );
    promises.push(getDocs(q));
  }

  const snapshots = await Promise.all(promises);
  const matchingDocs: Expert[] = [];

  for (const snap of snapshots) {
    for (const d of snap.docs) {
      const lat = d.get('lat');
      const lng = d.get('lng');
      const distanceInKm = distanceBetween([lat, lng], center);
      const distanceInM = distanceInKm * 1000;
      if (distanceInM <= radiusInM) {
        matchingDocs.push({ id: d.id, ...d.data() } as Expert);
      }
    }
  }

  return matchingDocs;
};

export const getExperts = async (type: string = 'all'): Promise<Expert[]> => {
  try {
    const expertsRef = collection(db, EXPERTS_COLLECTION);
    let q = query(expertsRef);
    
    if (type !== 'all') {
      q = query(expertsRef, where('type', '==', type));
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expert));
  } catch (error) {
    console.error("Error fetching experts:", error);
    return [];
  }
};

export const getExpertById = async (id: string): Promise<Expert | undefined> => {
  try {
    const docRef = doc(db, EXPERTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Expert;
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching expert:", error);
    return undefined;
  }
};