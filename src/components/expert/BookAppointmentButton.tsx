'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bookingSessionService } from '@/services/bookingSessionService';
import { Loader2 } from 'lucide-react';

interface BookAppointmentButtonProps {
  expertId: string;
  expertName: string;
}

export default function BookAppointmentButton({ expertId, expertName }: BookAppointmentButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBookClick = async () => {
    setIsLoading(true);
    try {
      // Create a secure, short-lived session
      const sessionId = await bookingSessionService.createSession(expertId, expertName);
      
      // Navigate using the scrambled session ID instead of plain IDs
      router.push(`/book-appointment/${sessionId}`);
    } catch (error) {
      console.error("Failed to create booking session:", error);
      alert("Could not initialize secure booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleBookClick}
      disabled={isLoading}
      className="w-full mt-6 bg-blue-600 dark:bg-blue-500 text-white py-4 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Initializing Secure Link...
        </>
      ) : (
        'Book Appointment'
      )}
    </button>
  );
}
