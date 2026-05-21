import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc, orderBy } from "firebase/firestore";
import { PublicExpert } from "@/types/expert";

const USERS_COLLECTION = 'users';

export const getExpertsNearLocation = async (lat: number, lng: number, radiusKm: number): Promise<PublicExpert[]> => {
  // Simple post-fetch distance sorting, as complex querying requires geohashes.
  const experts = await getExperts();
  
  return experts.filter(exp => {
    if (!exp.lat || !exp.lng) return false;
    const distanceKm = Math.sqrt(Math.pow(exp.lat - lat, 2) + Math.pow(exp.lng - lng, 2)) * 111; // Approx rough km
    return distanceKm <= radiusKm;
  });
};

export const getExperts = async (type: string = 'all'): Promise<PublicExpert[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    
    // We want users whose role is one of the professional types OR they explicitly have an expertProfile
    // Firestore lacks `in` query limitations for >10 items, but we have exactly 3.
    const q = query(usersRef, where('role', 'in', ['doctor', 'wellness_practitioner', 'hospital']));

    const snapshot = await getDocs(q);

    let results: PublicExpert[] = [];

    snapshot.docs.forEach(doc => {
      const userData = doc.data();
      const ep = userData.expertProfile || {};

      // Enforce Verified-Only directory logic
      if (userData.verificationStatus !== 'verified' && ep.verificationStatus !== 'verified') {
         return; // Skip unverified
      }

      const expert: PublicExpert = {
          id: doc.id,
          name: ep.name || userData.fullName || userData.username || 'Expert',
          type: ep.type || userData.role,
          specialty: ep.specialty || userData.specialty || userData.customSpecialty || 'General Practice',
          verificationStatus: 'verified',
          location: ep.location || [userData.city, userData.state, userData.country].filter(Boolean).join(', ') || 'Global',
          rating: ep.rating || userData.rating || 5.0,
          lat: ep.lat || userData.lat || 0,
          lng: ep.lng || userData.lng || 0,
          email: ep.email || userData.email,
          phone: ep.phone || userData.phone || userData.phoneNumber,
          imageUrl: ep.imageUrl || userData.imageUrl || userData.photoURL,
          bio: ep.bio || userData.bio,
          updatedAt: ep.updatedAt || userData.updatedAt || new Date().toISOString()
      };

      if (type === 'all' || expert.type === type) {
         results.push(expert);
      }
    });
    
    // Sort by rating desc
    return results.sort((a, b) => b.rating - a.rating);
  } catch (error) {
    console.error("Error fetching experts:", error);
    return [];
  }
};

export const getExpertById = async (id: string): Promise<PublicExpert | undefined> => {
  try {
    // 1. Fetch from 'users' collection exclusively
    const userRef = doc(db, USERS_COLLECTION, id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      // Only return if they have an expert role
      if (['doctor', 'wellness_practitioner', 'hospital'].includes(userData.role)) {
        // Use nested expertProfile if it exists, otherwise use top-level fields
        const ep = userData.expertProfile || {};
        
        return {
          id: userSnap.id,
          name: ep.name || userData.fullName || userData.username || 'Expert',
          type: ep.type || userData.role,
          specialty: ep.specialty || userData.specialty || userData.customSpecialty || 'General Practice',
          verificationStatus: ep.verificationStatus || userData.verificationStatus || 'unverified',
          location: ep.location || [userData.city, userData.state, userData.country].filter(Boolean).join(', ') || 'Global',
          rating: ep.rating || userData.rating || 5.0,
          lat: ep.lat || userData.lat || 0,
          lng: ep.lng || userData.lng || 0,
          email: ep.email || userData.email,
          phone: ep.phone || userData.phone || userData.phoneNumber,
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