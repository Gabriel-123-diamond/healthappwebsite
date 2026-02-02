import * as admin from 'firebase-admin';
import { geohashForLocation } from 'geofire-common';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Manually initialize Admin App if not already done (copied logic to be standalone)
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) {
  console.error("FIREBASE_SERVICE_ACCOUNT_JSON is not defined in .env.local");
  process.exit(1);
}

let serviceAccount;
try {
  const cleanedJson = serviceAccountJson.trim().replace(/^['"]|['"]$/g, '');
  serviceAccount = JSON.parse(cleanedJson);
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} catch (e) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON", e);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function seed() {
  console.log("Starting seed process...");

  // --- Helper Data for Random Generation ---
  const firstNames = ['Sarah', 'John', 'Amara', 'Wei', 'Kwame', 'Emily', 'Raj', 'Elena', 'Fatima', 'Carlos', 'Yuki', 'Zainab', 'David', 'Grace', 'Emmanuel', 'Li', 'Priya', 'Ahmed', 'Maria', 'James'];
  const lastNames = ['Johnson', 'Smith', 'Okafor', 'Chen', 'Mensah', 'Stone', 'Gupta', 'Rodriguez', 'Ali', 'Tanaka', 'Ibrahim', 'Kim', 'Santos', 'Patel', 'Diallo', 'Wong', 'Müller', 'Silva', 'Nguyen', 'Brown'];
  
  const medicalSpecialties = ['Cardiologist', 'General Practitioner', 'Pediatrician', 'Neurologist', 'Dermatologist', 'Orthopedist', 'Gynecologist', 'Psychiatrist', 'Oncologist', 'Internist', 'Dentist', 'Ophthalmologist', 'Nutritionist'];
  const herbalSpecialties = ['Herbalist', 'Traditional Chinese Medicine Practitioner', 'Naturopath', 'Holistic Therapist', 'Homeopath', 'Acupuncturist', 'Ayurvedic Practitioner'];

  const cities = [
    { city: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792 },
    { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
    { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
    { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
    { city: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074 },
    { city: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219 },
    { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
    { city: 'Sao Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
    { city: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
    { city: 'Toronto', country: 'Canada', lat: 43.6510, lng: -79.3470 },
    { city: 'Accra', country: 'Ghana', lat: 5.6037, lng: -0.1870 },
    { city: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473 },
    { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
    { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 }
  ];

  const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
  const getRandomRating = () => (3.5 + Math.random() * 1.5).toFixed(1); 

  const experts = [];
  const institutions = [];

  // Generate 60 Doctors
  for (let i = 0; i < 60; i++) {
    const location = getRandomElement(cities);
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const lat = location.lat + (Math.random() - 0.5) * 0.1;
    const lng = location.lng + (Math.random() - 0.5) * 0.1;
    
    experts.push({
      name: `Dr. ${firstName} ${lastName}`,
      type: 'doctor',
      specialty: getRandomElement(medicalSpecialties),
      location: `${location.city}, ${location.country}`,
      country: location.country,
      state: location.city, 
      lat: lat, 
      lng: lng,
      geohash: geohashForLocation([lat, lng]),
      rating: parseFloat(getRandomRating()),
      verified: Math.random() > 0.1, 
      imageUrl: `https://i.pravatar.cc/300?u=doc_${i}_${Date.now()}`,
      bio: `Dr. ${lastName} is a dedicated specialist with over ${Math.floor(Math.random() * 20 + 5)} years of experience in ${location.city}.`,
      createdAt: new Date().toISOString()
    });
  }

  // Generate 60 Herbalists
  for (let i = 0; i < 60; i++) {
    const location = getRandomElement(cities);
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const isDr = Math.random() > 0.7; 
    const lat = location.lat + (Math.random() - 0.5) * 0.1;
    const lng = location.lng + (Math.random() - 0.5) * 0.1;
    
    experts.push({
      name: `${isDr ? 'Dr. ' : ''}${firstName} ${lastName}`,
      type: 'herbalist',
      specialty: getRandomElement(herbalSpecialties),
      location: `${location.city}, ${location.country}`,
      country: location.country,
      state: location.city,
      lat: lat,
      lng: lng,
      geohash: geohashForLocation([lat, lng]),
      rating: parseFloat(getRandomRating()),
      verified: Math.random() > 0.2, 
      imageUrl: `https://i.pravatar.cc/300?u=herb_${i}_${Date.now()}`,
      bio: `${firstName} ${lastName} practices traditional healing methods passed down through generations combined with modern knowledge.`,
      createdAt: new Date().toISOString()
    });
  }

  // Generate 60 Hospitals
  const hospitalTypes = ['General Hospital', 'Teaching Hospital', 'Specialist Clinic', 'Medical Center', 'Community Health Center'];
  const hospitalNames = ['St. Marys', 'City Central', 'Global Care', 'Heritage Health', 'Unity Medical', 'Sunrise', 'Evergreen', 'Metropolitan', 'Riverside', 'Beacon'];

  for (let i = 0; i < 60; i++) {
    const location = getRandomElement(cities);
    const name = getRandomElement(hospitalNames);
    const type = getRandomElement(hospitalTypes);
    const lat = location.lat + (Math.random() - 0.5) * 0.1;
    const lng = location.lng + (Math.random() - 0.5) * 0.1;

    institutions.push({
      name: `${name} ${type}`,
      type: 'hospital',
      category: type,
      location: `${location.city}, ${location.country}`,
      country: location.country,
      state: location.city,
      lat: lat,
      lng: lng,
      geohash: geohashForLocation([lat, lng]),
      rating: parseFloat(getRandomRating()),
      verified: true,
      facilities: ['Emergency', 'Laboratory', 'Pharmacy', 'Radiology'].slice(0, Math.floor(Math.random() * 4) + 1),
      imageUrl: `https://images.unsplash.com/photo-1587350859728-117622bc937e?auto=format&fit=crop&q=80&w=300&u=hosp_${i}`,
      createdAt: new Date().toISOString()
    });
  }

  // Batch Write
  const batch = db.batch();
  
  experts.forEach((expert) => {
    const docRef = db.collection('experts').doc();
    batch.set(docRef, expert);
  });

  institutions.forEach((inst) => {
    const docRef = db.collection('institutions').doc();
    batch.set(docRef, inst);
  });

  await batch.commit();
  console.log(`Seeded ${experts.length} experts and ${institutions.length} institutions.`);
}

seed()
  .then(() => {
    console.log("Seeding complete.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
