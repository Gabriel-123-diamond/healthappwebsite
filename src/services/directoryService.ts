import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc, setDoc, deleteDoc, orderBy, startAt, endAt } from "firebase/firestore";
import { geohashForLocation, geohashQueryBounds, distanceBetween } from "geofire-common";

export interface Expert {
  id: string;
  name: string;
  type: 'doctor' | 'herbalist' | 'hospital';
  specialty: string;
  location: string;
  rating: number;
  verified: boolean;
  imageUrl?: string;
  lat: number;
  lng: number;
  geohash: string;
}

const EXPERTS_COLLECTION = 'experts';

// Keep mock data for seeding
const INITIAL_EXPERTS: any[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    type: 'doctor',
    specialty: 'Cardiologist',
    location: 'New York, NY',
    rating: 4.9,
    verified: true,
    lat: 40.7128,
    lng: -74.0060
  },
  {
    id: '2',
    name: 'Green Leaf Wellness',
    type: 'herbalist',
    specialty: 'Traditional Chinese Medicine',
    location: 'San Francisco, CA',
    rating: 4.8,
    verified: true,
    lat: 37.7749,
    lng: -122.4194
  },
  {
    id: '3',
    name: 'General City Hospital',
    type: 'hospital',
    specialty: 'Emergency & Trauma',
    location: 'Chicago, IL',
    rating: 4.5,
    verified: true,
    lat: 41.8781,
    lng: -87.6298
  }
];

export const seedExperts = async () => {
  const expertsRef = collection(db, EXPERTS_COLLECTION);
  const snapshot = await getDocs(expertsRef);
  
  if (!snapshot.empty) {
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }

  for (const expert of INITIAL_EXPERTS) {
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

export const getExpertById = async (id: string): Promise<Expert | undefined> => {
  try {
    const docRef = doc(db, EXPERTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Expert;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching expert:", error);
    return undefined;
  }
};