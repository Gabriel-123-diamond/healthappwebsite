'use client';

import React, { useState } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import CustomTimePicker from '@/components/common/CustomTimePicker';

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
  const consultationFee = 2500; // Example fee in Naira or local currency

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time.');
      return;
    }

    if (!confirm(`You will be charged ₦${consultationFee.toLocaleString()} for this consultation. Proceed to payment?`)) {
      return;
    }

    try {
      await bookAppointment(selectedDate, selectedTime);
      alert(`Payment successful! Appointment requested with ${expertName} for ${selectedDate} at ${selectedTime}!`);
      router.push('/appointments');
    } catch (error) {
      if (error instanceof Error && error.message === 'User not authenticated') {
         alert('You must be logged in to book an appointment.');
         router.push('/auth/signin');
      } else {
         alert('Failed to book appointment. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 sm:pt-40 pb-12 px-4 transition-colors duration-200">
      <div className="max-w-xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-xl overflow-hidden transition-colors duration-200 border border-slate-100 dark:border-slate-700">
          <div className="bg-blue-600 p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-black mb-2 tracking-tight">Book Appointment</h1>
              <p className="text-blue-100 font-medium">Schedule a consultation with {expertName}</p>
            </div>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          </div>

          <form onSubmit={handleBook} className="p-10 space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Select Date
                  </div>
                </label>
                <CustomDatePicker 
                  value={selectedDate}
                  onChange={(val) => setSelectedDate(val)}
                  placeholder="Select Appointment Date"
                  minDate={new Date()}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Select Time
                  </div>
                </label>
                <CustomTimePicker 
                  value={selectedTime}
                  onChange={(val) => setSelectedTime(val)}
                  placeholder="Select Appointment Time"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Consultation Fee</span>
                 <span className="text-slate-900 dark:text-white font-black">₦{consultationFee.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center text-xs text-slate-400">
                 <span>Processing Fee</span>
                 <span>Included</span>
               </div>
               <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                 <span className="text-slate-900 dark:text-white font-black uppercase tracking-widest">Total Due</span>
                 <span className="text-blue-600 text-xl font-black tracking-tight">₦{consultationFee.toLocaleString()}</span>
               </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-slate-200 dark:shadow-none"
              >
                {isLoading ? (
                  <>Processing Payment...</>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Pay & Confirm Booking
                  </>
                )}
              </button>
              <p className="text-center mt-6 text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-wider">
                Secured by Ikiké Health Payment Protocol. <br />
                Refunds available up to 24h before appointment.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
