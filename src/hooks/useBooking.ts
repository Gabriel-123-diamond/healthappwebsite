import { useState } from 'react';
import { createAppointment } from '@/services/appointmentService';
import { auth } from '@/lib/firebase';

export function useBooking(expertId: string, expertName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookAppointment = async (date: string, time: string) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      await createAppointment(
        user.uid,
        expertId,
        expertName,
        date,
        time
      );
      return true;
    } catch (err) {
      console.error(err);
      setError('Failed to book appointment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { bookAppointment, isLoading, error };
}
