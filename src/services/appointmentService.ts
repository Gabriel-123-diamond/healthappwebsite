import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, getDocs, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { Appointment } from '@/types/appointment';
import { notificationTrigger } from './notificationTrigger';

const APPOINTMENTS_COLLECTION = 'appointments';
const AVAILABILITY_COLLECTION = 'expert_availability';

export const appointmentService = {
  createAppointment: async (
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
        paid: true,
        fee,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  getUserAppointments: (userId: string, callback: (appointments: Appointment[]) => void) => {
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
  },

  getExpertAppointments: (expertId: string, callback: (appointments: Appointment[]) => void) => {
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
  },

  updateAppointmentStatus: async (appointmentId: string, status: 'confirmed' | 'cancelled') => {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    const docSnap = await getDoc(appointmentRef);
    const data = docSnap.data();

    await updateDoc(appointmentRef, { status });

    if (data) {
      notificationTrigger.notifyAppointmentUpdate(data.userId, status, data.expertName);
    }
  },

  setExpertAvailability: async (expertId: string, availabilityData: any) => {
    const availabilityRef = doc(db, AVAILABILITY_COLLECTION, expertId);
    await setDoc(availabilityRef, {
      ...availabilityData,
      updatedAt: new Date().toISOString()
    });
  },

  getExpertAvailability: async (expertId: string) => {
    const q = query(collection(db, AVAILABILITY_COLLECTION), where('expertId', '==', expertId));
    const docSnap = await getDocs(q);
    return docSnap.docs[0]?.data();
  }
};
