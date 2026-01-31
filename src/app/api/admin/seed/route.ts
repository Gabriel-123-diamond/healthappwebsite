import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { geohashForLocation } from "geofire-common";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Server misconfiguration: ADMIN_PASSWORD not set" }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized: Invalid password" }, { status: 401 });
    }

    // --- Seeding Logic ---
    const expertsCollection = adminDb.collection("experts");
    
    // Helper to generate random coordinates near a center
    const getRandomLocation = (centerLat: number, centerLng: number, radiusKm: number) => {
      const r = radiusKm / 111.32; // Convert km to degrees
      const u = Math.random();
      const v = Math.random();
      const w = r * Math.sqrt(u);
      const t = 2 * Math.PI * v;
      const x = w * Math.cos(t);
      const y = w * Math.sin(t);
      const newLat = x + centerLat;
      const newLng = y / Math.cos(centerLat * Math.PI / 180) + centerLng;
      return { lat: newLat, lng: newLng };
    };

    const diseases = [
      "Heart Disease", "Skin Rash", "Diabetes", "Malaria", "Typhoid", 
      "Arthritis", "Asthma", "Cancer", "Depression", "Anxiety", 
      "Eczema", "Glaucoma", "Hepatitis", "HIV/AIDS", "Infertility",
      "Insomnia", "Kidney Disease", "Liver Disease", "Migraine", "Obesity"
    ];

    const medicalSpecialties = ['Cardiologist', 'General Practitioner', 'Pediatrician', 'Neurologist', 'Dermatologist', 'Orthopedist', 'Gynecologist', 'Psychiatrist', 'Oncologist', 'Internist', 'Dentist', 'Ophthalmologist', 'Nutritionist'];
    const herbalSpecialties = ['Herbalist', 'Traditional Chinese Medicine Practitioner', 'Naturopath', 'Holistic Therapist', 'Homeopath', 'Acupuncturist', 'Ayurvedic Practitioner'];
    
    const baseLocations = [
      { name: "Lagos", state: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
      { name: "New York", state: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
      { name: "London", state: "Greater London", country: "UK", lat: 51.5074, lng: -0.1278 },
      { name: "Mumbai", state: "Maharashtra", country: "India", lat: 19.0760, lng: 72.8777 },
      { name: "Beijing", state: "Beijing", country: "China", lat: 39.9042, lng: 116.4074 },
      { name: "Nairobi", state: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
      { name: "Berlin", state: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
      { name: "Sao Paulo", state: "Sao Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
      { name: "Cairo", state: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
      { name: "Toronto", state: "Ontario", country: "Canada", lat: 43.6510, lng: -79.3470 }
    ];

    const batch = adminDb.batch();
    let count = 0;

    // Generate 150 experts (50 of each type)
    const types: ('doctor' | 'herbalist' | 'hospital')[] = ['doctor', 'herbalist', 'hospital'];

    for (const type of types) {
      for (let i = 0; i < 50; i++) {
        const baseLoc = baseLocations[Math.floor(Math.random() * baseLocations.length)];
        const loc = getRandomLocation(baseLoc.lat, baseLoc.lng, 15);
        const geohash = geohashForLocation([loc.lat, loc.lng]);
        const id = adminDb.collection(type === 'hospital' ? "institutions" : "experts").doc().id;
        const ref = adminDb.collection(type === 'hospital' ? "institutions" : "experts").doc(id);

        let specialty = "";
        let name = "";

        if (type === 'doctor') {
          specialty = medicalSpecialties[Math.floor(Math.random() * medicalSpecialties.length)];
          name = `Dr. ${['James', 'Sarah', 'John', 'Amara', 'Wei'][i % 5]} ${['Johnson', 'Smith', 'Okafor', 'Chen', 'Mensah'][Math.floor(Math.random() * 5)]}`;
        } else if (type === 'herbalist') {
          specialty = herbalSpecialties[Math.floor(Math.random() * herbalSpecialties.length)];
          name = `${['Bio', 'Green', 'Nature', 'Pure'][i % 4]} ${['Healing', 'Wellness', 'Roots', 'Life'][Math.floor(Math.random() * 4)]}`;
        } else {
          specialty = "General Healthcare";
          name = `${baseLoc.name} ${['Central', 'Memorial', 'City', 'Unity'][i % 4]} Hospital`;
        }

        const data = {
          name,
          type,
          specialty,
          location: `${baseLoc.name}, ${baseLoc.country}`,
          country: baseLoc.country,
          state: baseLoc.state,
          rating: (4.0 + Math.random()).toFixed(1),
          verified: true,
          lat: loc.lat,
          lng: loc.lng,
          geohash: geohash,
          createdAt: new Date().toISOString()
        };

        batch.set(ref, data);
        count++;
      }
    }

    await batch.commit();

    return NextResponse.json({ message: `Successfully seeded ${count} global experts and institutions.` });

  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
