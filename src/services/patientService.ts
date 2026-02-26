import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ConsultationNote, PatientRecord } from '@/types/patient';

export const patientService = {
  /**
   * Fetches unique patients who have booked with this expert.
   */
  getMyPatients: async (expertId: string): Promise<PatientRecord[]> => {
    // 1. Get unique userIds from confirmed appointments
    const q = query(
      collection(db, 'appointments'),
      where('expertId', '==', expertId),
      where('status', '==', 'confirmed')
    );
    
    const snapshot = await getDocs(q);
    const userIds = Array.from(new Set(snapshot.docs.map(doc => doc.data().userId)));
    
    if (userIds.length === 0) return [];

    // 2. Fetch user profile details for each patient
    const patients: PatientRecord[] = [];
    for (const uid of userIds) {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        patients.push({
          id: uid,
          name: data.name || 'Anonymous Patient',
          email: data.email || 'N/A',
          totalConsultations: snapshot.docs.filter(d => d.data().userId === uid).length,
          status: 'active'
        });
      }
    }
    
    return patients;
  },

  /**
   * Adds a new consultation note for a patient.
   */
  addConsultationNote: async (note: Omit<ConsultationNote, 'id' | 'createdAt'>) => {
    const docRef = await addDoc(collection(db, 'consultation_notes'), {
      ...note,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  /**
   * Fetches consultation notes for a specific patient seen by this expert.
   */
  getPatientNotes: async (expertId: string, patientId: string): Promise<ConsultationNote[]> => {
    const q = query(
      collection(db, 'consultation_notes'),
      where('expertId', '==', expertId),
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ConsultationNote[];
  }
};
