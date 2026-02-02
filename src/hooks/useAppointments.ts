import { useState, useEffect } from 'react';
import { getUserAppointments } from '@/services/appointmentService';
import { auth } from '@/lib/firebase';
import { Appointment } from '@/types/appointment';
import { onAuthStateChanged, User } from 'firebase/auth';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const unsubscribeFirestore = getUserAppointments(currentUser.uid, (data) => {
            setAppointments(data);
            setLoading(false);
          });
          return () => unsubscribeFirestore();
        } catch (err) {
          console.error('Error fetching appointments:', err);
          setError('Failed to load appointments');
          setLoading(false);
        }
      } else {
        setAppointments([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { appointments, loading, user, error };
}
