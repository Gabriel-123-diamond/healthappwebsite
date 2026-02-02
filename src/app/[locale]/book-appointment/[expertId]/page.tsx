'use client';

import React, { useState } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function BookingPage({ params }: { params: Promise<{ expertId: string }> }) {
  // Unwrap params using React.use() or await in async component
  // Since this is a client component, we need to handle the promise or just expect the prop if it was server component.
  // Actually, in Next.js 15 client components receive params directly as props? 
  // Wait, params is a Promise in the latest Next.js versions for server components.
  // For client components, we use `useParams` hook or `React.use(params)`.
  // Let's use `use` for safety as per modern Next.js patterns if params is a promise.
  
  // However, simpler pattern for client component:
  const resolvedParams = React.use(params);
  const { expertId } = resolvedParams;
  
  const searchParams = useSearchParams();
  const expertName = searchParams.get('name') || 'the Expert';

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const router = useRouter();
  
  const { bookAppointment, isLoading } = useBooking(expertId, expertName);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time.');
      return;
    }

    try {
      await bookAppointment(selectedDate, selectedTime);
      alert(`Appointment requested with ${expertName} for ${selectedDate} at ${selectedTime}!`);
      router.push('/appointments');
    } catch (error) {
      if (error instanceof Error && error.message === 'User not authenticated') {
         alert('You must be logged in to book an appointment.');
         router.push('/auth/login');
      } else {
         alert('Failed to book appointment. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 transition-colors duration-200">
      <div className="max-w-xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
          <div className="bg-blue-600 p-8 text-white">
            <h1 className="text-2xl font-bold mb-2">Book Appointment</h1>
            <p className="text-blue-100">Schedule a consultation with {expertName}</p>
          </div>

          <form onSubmit={handleBook} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Select Date
                </div>
              </label>
              <input 
                type="date" 
                required
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Select Time
                </div>
              </label>
              <input 
                type="time" 
                required
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
