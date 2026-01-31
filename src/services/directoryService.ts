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
    location: 'New York, NY, USA',
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
    location: 'San Francisco, CA, USA',
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
    location: 'Chicago, IL, USA',
    rating: 4.5,
    verified: true,
    lat: 41.8781,
    lng: -87.6298
  },
  {
    id: '4',
    name: 'Dr. Chioma Okeke',
    type: 'doctor',
    specialty: 'Pediatrician',
    location: 'Lagos, Nigeria',
    rating: 4.9,
    verified: true,
    lat: 6.5244,
    lng: 3.3792
  },
  {
    id: '5',
    name: 'Royal London Hospital',
    type: 'hospital',
    specialty: 'General Medicine',
    location: 'London, UK',
    rating: 4.7,
    verified: true,
    lat: 51.5074,
    lng: -0.1278
  },
  {
    id: '6',
    name: 'Dr. Wei Zhang',
    type: 'doctor',
    specialty: 'Neurologist',
    location: 'Beijing, China',
    rating: 4.8,
    verified: true,
    lat: 39.9042,
    lng: 116.4074
  },
  {
    id: '7',
    name: 'Mumbai Heart Institute',
    type: 'hospital',
    specialty: 'Cardiology',
    location: 'Mumbai, India',
    rating: 4.9,
    verified: true,
    lat: 19.0760,
    lng: 72.8777
  },
  {
    id: '8',
    name: 'Dr. Ana Silva',
    type: 'doctor',
    specialty: 'Dermatologist',
    location: 'Sao Paulo, Brazil',
    rating: 4.8,
    verified: true,
    lat: -23.5505,
    lng: -46.6333
  },
  {
    id: '9',
    name: 'Berlin Naturheilpraxis',
    type: 'herbalist',
    specialty: 'Homeopathy',
    location: 'Berlin, Germany',
    rating: 4.6,
    verified: true,
    lat: 52.5200,
    lng: 13.4050
  },
  {
    id: '10',
    name: 'Dr. Yuki Tanaka',
    type: 'doctor',
    specialty: 'Ophthalmologist',
    location: 'Tokyo, Japan',
    rating: 4.9,
    verified: true,
    lat: 35.6762,
    lng: 139.6503
  },
  {
    id: '11',
    name: 'Nairobi Wellness Centre',
    type: 'doctor',
    specialty: 'General Practitioner',
    location: 'Nairobi, Kenya',
    rating: 4.5,
    verified: true,
    lat: -1.2921,
    lng: 36.8219
  },
  {
    id: '12',
    name: 'Paris Vision Clinic',
    type: 'doctor',
    specialty: 'Ophthalmologist',
    location: 'Paris, France',
    rating: 4.8,
    verified: true,
    lat: 48.8566,
    lng: 2.3522
  },
  {
    id: '13',
    name: 'Sydney Dental Care',
    type: 'doctor',
    specialty: 'Dentist',
    location: 'Sydney, Australia',
    rating: 4.7,
    verified: true,
    lat: -33.8688,
    lng: 151.2093
  },
  {
    id: '14',
    name: 'Cairo Medical Specialists',
    type: 'doctor',
    specialty: 'Internal Medicine',
    location: 'Cairo, Egypt',
    rating: 4.6,
    verified: true,
    lat: 30.0444,
    lng: 31.2357
  },
  {
    id: '15',
    name: 'Toronto Holistic Health',
    type: 'herbalist',
    specialty: 'Naturopathy',
    location: 'Toronto, Canada',
    rating: 4.8,
    verified: true,
    lat: 43.6510,
    lng: -79.3470
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

export const getExperts = async (type: string = 'all'): Promise<Expert[]> => {
  try {
    const expertsRef = collection(db, EXPERTS_COLLECTION);
    let q = query(expertsRef);
    
    if (type !== 'all') {
      q = query(expertsRef, where('type', '==', type));
    }
    
    const snapshot = await getDocs(q);
    
    // Fallback to mock data if no experts found (for development/demo)
    if (snapshot.empty && type === 'all') {
      return INITIAL_EXPERTS as Expert[];
    }
    
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
      return docSnap.data() as Expert;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching expert:", error);
    return undefined;
  }
};