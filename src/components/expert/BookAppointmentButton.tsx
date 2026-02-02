'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface BookAppointmentButtonProps {
  expertId: string;
  expertName: string;
}

export default function BookAppointmentButton({ expertId, expertName }: BookAppointmentButtonProps) {
  const router = useRouter();

  const handleBookClick = () => {
    // Navigate to the booking page with expert name as a query parameter
    router.push(`/book-appointment/${expertId}?name=${encodeURIComponent(expertName)}`);
  };

  return (
    <button 
      onClick={handleBookClick}
      className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
    >
      Book Appointment
    </button>
  );
}
