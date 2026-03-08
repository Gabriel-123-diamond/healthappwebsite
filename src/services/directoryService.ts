import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc, setDoc, deleteDoc, orderBy, startAt, endAt } from "firebase/firestore";
import { geohashForLocation, geohashQueryBounds, distanceBetween } from "geofire-common";
import { MOCK_EXPERTS } from "@/data/mockExperts";
import { Expert, PublicExpert } from "@/types/expert";

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

export const getExpertsNearby = async (center: [number, number], radiusInM: number): Promise<PublicExpert[]> => {
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
  const matchingDocs: PublicExpert[] = [];

  for (const snap of snapshots) {
    for (const d of snap.docs) {
      const lat = d.get('lat');
      const lng = d.get('lng');
      const distanceInKm = distanceBetween([lat, lng], center);
      const distanceInM = distanceInKm * 1000;
      if (distanceInM <= radiusInM) {
        matchingDocs.push({ id: d.id, ...d.data() } as PublicExpert);
      }
    }
  }

  return matchingDocs;
};

export const getExperts = async (type: string = 'all'): Promise<PublicExpert[]> => {
  try {
    const expertsRef = collection(db, EXPERTS_COLLECTION);
    let q = query(expertsRef);
    
    if (type !== 'all') {
      q = query(expertsRef, where('type', '==', type));
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PublicExpert));
  } catch (error) {
    console.error("Error fetching experts:", error);
    return [];
  }
};

export const getExpertById = async (id: string): Promise<PublicExpert | undefined> => {
  try {
    // 1. Try fetching from 'experts' collection (primary directory)
    const docRef = doc(db, EXPERTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as PublicExpert;
    }

    // 2. Fallback to 'users' collection (for professionals not yet in primary directory)
    const userRef = doc(db, 'users', id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      // Only return if they have an expert role
      if (['doctor', 'herbal_practitioner', 'hospital', 'expert'].includes(userData.role)) {
        // Use nested expertProfile if it exists, otherwise use top-level fields
        const ep = userData.expertProfile || {};
        
        return {
          id: userSnap.id,
          name: ep.name || userData.fullName || userData.username || 'Expert',
          type: ep.type || (userData.role === 'expert' ? 'doctor' : userData.role),
          specialty: ep.specialty || userData.specialty || userData.customSpecialty || 'General Practice',
          verificationStatus: ep.verificationStatus || userData.verificationStatus || 'unverified',
          location: ep.location || [userData.city, userData.state, userData.country].filter(Boolean).join(', ') || 'Global',
          rating: ep.rating || userData.rating || 5.0,
          lat: ep.lat || userData.lat || 0,
          lng: ep.lng || userData.lng || 0,
          imageUrl: ep.imageUrl || userData.imageUrl || userData.photoURL,
          bio: ep.bio || userData.bio,
          updatedAt: ep.updatedAt || userData.updatedAt || new Date().toISOString()
        } as PublicExpert;
      }
    }

    return undefined;
  } catch (error) {
    console.error("Error fetching expert:", error);
    return undefined;
  }
};