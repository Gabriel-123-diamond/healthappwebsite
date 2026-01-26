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
      "Catarrh", "High Blood Pressure", "Diabetes", "Malaria", "Typhoid", 
      "Arthritis", "Asthma", "Cancer", "Depression", "Anxiety", 
      "Eczema", "Glaucoma", "Hepatitis", "HIV/AIDS", "Infertility",
      "Insomnia", "Kidney Disease", "Liver Disease", "Migraine", "Obesity",
      "Pneumonia", "Stroke", "Tuberculosis", "Ulcer", "Vertigo",
      "Allergies", "Back Pain", "Cholera", "Dengue", "Epilepsy",
      "Fibroids", "Gout", "Heart Attack", "Indigestion", "Jaundice",
      "Keloids", "Lupus", "Measles", "Nausea", "Osteoporosis",
      "Psoriasis", "Ringworm", "Scabies", "Tetanus", "UTI",
      "Varicose Veins", "Warts", "Yeast Infection", "Zika Virus", "Acne"
    ];

    const expertTypes = ["doctor", "specialist", "herbalist", "hospital"];
    
    const baseLocations = [
      { name: "Lagos", state: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
      { name: "Abuja", state: "FCT", country: "Nigeria", lat: 9.0765, lng: 7.3986 },
      { name: "Port Harcourt", state: "Rivers", country: "Nigeria", lat: 9.0563, lng: 7.4985 },
      { name: "New York", state: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
      { name: "London", state: "Greater London", country: "UK", lat: 51.5074, lng: -0.1278 },
      { name: "Texas", state: "Texas", country: "USA", lat: 31.9686, lng: -99.9018 },
      { name: "California", state: "California", country: "USA", lat: 36.7783, lng: -119.4179 },
      { name: "Toronto", state: "Ontario", country: "Canada", lat: 43.65107, lng: -79.347015 },
      { name: "Accra", state: "Greater Accra", country: "Ghana", lat: 5.6037, lng: -0.1870 },
      { name: "Nairobi", state: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 }
    ];

    const batch = adminDb.batch();
    let count = 0;

    // Generate 100 experts
    for (let i = 0; i < 100; i++) {
      const disease = diseases[i % diseases.length];
      const type = expertTypes[Math.floor(Math.random() * expertTypes.length)];
      const baseLoc = baseLocations[Math.floor(Math.random() * baseLocations.length)];
      const loc = getRandomLocation(baseLoc.lat, baseLoc.lng, 10); // Within 10km
      const geohash = geohashForLocation([loc.lat, loc.lng]);

      const id = expertsCollection.doc().id;
      const ref = expertsCollection.doc(id);

      const expertData = {
        name: type === 'hospital' ? `${baseLoc.name} ${disease} Center` : `Dr. Expert ${i + 1}`,
        type: type,
        specialty: disease,
        location: `${baseLoc.name}, ${baseLoc.country}`,
        country: baseLoc.country,
        state: baseLoc.state,
        rating: (4.0 + Math.random()).toFixed(1),
        verified: Math.random() > 0.2, // 80% verified
        lat: loc.lat,
        lng: loc.lng,
        geohash: geohash,
        description: `Specializing in the treatment and management of ${disease}.`,
        contact: `+1-555-01${i.toString().padStart(2, '0')}`,
        experience: `${Math.floor(Math.random() * 20) + 5} years`
      };

      batch.set(ref, expertData);
      count++;
    }

    await batch.commit();

    return NextResponse.json({ message: `Successfully seeded ${count} experts.` });

  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
