import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, query } from "firebase/firestore";

const EXPERTS_DATA = [
  {
    name: "Dr. Sarah Chen",
    type: "doctor",
    specialty: "General Medicine",
    address: "123 Health Ave, New York, NY",
    location: { lat: 40.7128, lng: -74.0060 },
    phone: "+1-555-0101",
    verified: true,
    rating: 4.8
  },
  {
    name: "Master Herbalist Kofi Mensah",
    type: "herbalist",
    specialty: "Traditional Plant Medicine",
    address: "45 Green Way, Brooklyn, NY",
    location: { lat: 40.6782, lng: -73.9442 },
    phone: "+1-555-0202",
    verified: true,
    rating: 4.9
  },
  {
    name: "City Central Hospital",
    type: "hospital",
    specialty: "Emergency & Trauma",
    address: "900 First St, Manhattan, NY",
    location: { lat: 40.7306, lng: -73.9352 },
    phone: "+1-555-9111",
    verified: true,
    isEmergency: true
  }
];

export async function seedDatabase() {
  console.log("Starting database seeding process...");
  
  try {
    if (!db) throw new Error("Firestore instance (db) is not initialized.");
    
    const expertsRef = collection(db, "directory");
    console.log("Accessing 'directory' collection...");
    
    // 1. Clear existing data
    const existing = await getDocs(query(expertsRef));
    console.log(`Found ${existing.size} existing records. Starting deletion...`);
    
    const deletePromises = existing.docs.map(doc => {
        console.log(`Deleting doc: ${doc.id}`);
        return deleteDoc(doc.ref);
    });
    await Promise.all(deletePromises);
    console.log("Deletion completed.");

    // 2. Add new data
    console.log(`Adding ${EXPERTS_DATA.length} new records...`);
    for (const item of EXPERTS_DATA) {
      const docRef = await addDoc(expertsRef, item);
      console.log(`Successfully added: ${item.name} (ID: ${docRef.id})`);
    }

    console.log("Seeding process completed successfully!");
    return { success: true };
  } catch (error: any) {
    console.error("Critical Seeding Error:", error);
    return { success: false, error: { message: error.message, stack: error.stack } };
  }
}
