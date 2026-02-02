import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { geohashForLocation } from 'geofire-common';
import { MOCK_EXPERTS } from '@/data/mockExperts';

export async function POST(request: Request) {
  try {
    const { headers } = request;
    const adminPassword = headers.get('x-admin-password');

    // Use environment variable for security
    if (!process.env.ADMIN_PASSWORD || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin password' }, { status: 401 });
    }

    // --- Helper Data for Random Generation ---
    const firstNames = ['Sarah', 'John', 'Amara', 'Wei', 'Kwame', 'Emily', 'Raj', 'Elena', 'Fatima', 'Carlos', 'Yuki', 'Zainab', 'David', 'Grace', 'Emmanuel', 'Li', 'Priya', 'Ahmed', 'Maria', 'James'];
    const lastNames = ['Johnson', 'Smith', 'Okafor', 'Chen', 'Mensah', 'Stone', 'Gupta', 'Rodriguez', 'Ali', 'Tanaka', 'Ibrahim', 'Kim', 'Santos', 'Patel', 'Diallo', 'Wong', 'Müller', 'Silva', 'Nguyen', 'Brown'];
    
    // Updated to use Professional Titles for better search matching
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
    const getRandomRating = () => (3.5 + Math.random() * 1.5).toFixed(1); // 3.5 to 5.0

    const experts = [];
    const institutions = [];

    // --- Add MOCK_EXPERTS to the list first ---
    MOCK_EXPERTS.forEach(mockExpert => {
      // Ensure mock experts have geohash if missing (though interface says they have lat/lng)
      const geohash = geohashForLocation([mockExpert.lat, mockExpert.lng]);
      experts.push({
        ...mockExpert,
        geohash,
        createdAt: new Date().toISOString()
      });
    });

    // --- Generate 60 Doctors ---
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

    // --- Generate 60 Herbalists ---
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

    // --- Generate 60 Hospitals/Institutions ---
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

    // Batch write to Firestore (batches hold up to 500 ops)
    const batch = adminDb.batch();
    
    experts.forEach((expert) => {
      const docRef = adminDb.collection('experts').doc();
      batch.set(docRef, expert);
    });

    institutions.forEach((inst) => {
      const docRef = adminDb.collection('institutions').doc();
      batch.set(docRef, inst);
    });

    await batch.commit();

    // --- Seed Articles (Keeping existing logic + adding a few more) ---
    const articles = [
      {
        title: 'The Role of Curcumin in Chronic Inflammation',
        category: 'Herbal',
        evidenceGrade: 'A',
        summary: 'Extensive research highlights the potent anti-inflammatory properties of turmeric-derived curcumin.',
        date: 'Jan 24, 2026'
      },
      {
        title: 'Hypertension: Standard Medical Protocols',
        category: 'Medical',
        evidenceGrade: 'A',
        summary: 'A summary of the current guidelines for managing high blood pressure.',
        date: 'Jan 20, 2026'
      },
      {
        title: 'Managing Diabetes with Diet and Lifestyle',
        category: 'Medical',
        evidenceGrade: 'A',
        summary: 'Key lifestyle changes that can help manage Type 2 Diabetes effectively.',
        date: 'Jan 15, 2026'
      },
      {
        title: 'Aloe Vera: Beyond Sunburn Relief',
        category: 'Herbal',
        evidenceGrade: 'B',
        summary: 'Exploring the digestive and skin health benefits of Aloe Vera.',
        date: 'Jan 10, 2026'
      }
    ];

    for (const article of articles) {
      // Add if unique logic could go here, but for simple seed we just add
      await adminDb.collection('articles').add(article);
    }

    return NextResponse.json({ 
      message: `Database seeded successfully with ${experts.length} experts, ${institutions.length} hospitals, and ${articles.length} articles.` 
    });
    
  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}