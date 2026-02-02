import { db } from '@/lib/firebase'; // Assuming initialized db export
import { collection, addDoc, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { Appointment } from '@/types/appointment';

const APPOINTMENTS_COLLECTION = 'appointments';

export const createAppointment = async (
  userId: string,
  expertId: string,
  expertName: string,
  date: string,
  time: string
) => {
  try {
    await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
      userId,
      expertId,
      expertName,
      date,
      time,
      status: 'pending',
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
