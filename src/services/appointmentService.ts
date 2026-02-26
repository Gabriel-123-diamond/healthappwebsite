import { db } from '@/lib/firebase'; // Assuming initialized db export
import { collection, addDoc, query, where, orderBy, onSnapshot, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { Appointment } from '@/types/appointment';

const APPOINTMENTS_COLLECTION = 'appointments';
const AVAILABILITY_COLLECTION = 'expert_availability';

export const createAppointment = async (
  userId: string,
  expertId: string,
  expertName: string,
  date: string,
  time: string,
  fee: number = 2500
) => {
  try {
    await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
      userId,
      expertId,
      expertName,
      date,
      time,
      status: 'pending',
      paid: true, // Assuming payment was successful if this is called after payment step
      fee,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const getUserAppointments = (userId: string, callback: (appointments: Appointment[]) => void) => {
  const q = query(
    collection(db, APPOINTMENTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('date', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];
    callback(appointments);
  });
};

export const getExpertAppointments = (expertId: string, callback: (appointments: Appointment[]) => void) => {
  const q = query(
    collection(db, APPOINTMENTS_COLLECTION),
    where('expertId', '==', expertId),
    orderBy('date', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];
    callback(appointments);
  });
};

export const updateAppointmentStatus = async (appointmentId: string, status: 'confirmed' | 'cancelled') => {
  const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
  await updateDoc(appointmentRef, { status });
};

// Availability management
export const setExpertAvailability = async (expertId: string, availabilityData: any) => {
  const availabilityRef = doc(db, AVAILABILITY_COLLECTION, expertId);
  await setDoc(availabilityRef, {
    ...availabilityData,
    updatedAt: new Date().toISOString()
  });
};

export const getExpertAvailability = async (expertId: string) => {
  const docRef = doc(db, AVAILABILITY_COLLECTION, expertId);
  const docSnap = await getDocs(query(collection(db, AVAILABILITY_COLLECTION), where('expertId', '==', expertId)));
  // Simpler approach for now
  return docSnap.docs[0]?.data();
};
