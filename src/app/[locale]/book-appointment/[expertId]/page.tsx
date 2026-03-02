'use client';

import React, { useState } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import CustomAnalogTimePicker from '@/components/common/CustomAnalogTimePicker';

export default function BookingPage({ params }: { params: Promise<{ expertId: string }> }) {
  const resolvedParams = React.use(params);
  const { expertId } = resolvedParams;
  
  const searchParams = useSearchParams();
  const expertName = searchParams.get('name') || 'the Expert';

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const router = useRouter();
  
  const { bookAppointment, isLoading } = useBooking(expertId, expertName);
  const consultationFee = 2500; // Example fee in Naira or local currency

  const handleTimeClick = () => {
    if (!selectedDate) {
      alert('Please select a date first.');
      return false;
    }
    return true;
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert('Please select an appointment date.');
      return;
    }
    if (!selectedTime) {
      alert('Please select an appointment time.');
      return;
    }

    if (!confirm(`Confirm Booking: ₦${consultationFee.toLocaleString()} will be charged for your consultation with ${expertName}. Proceed?`)) {
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
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors font-bold"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-xl overflow-hidden transition-colors duration-200 border border-slate-100 dark:border-slate-700">
          <div className="bg-blue-600 p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <CheckCircle size={12} />
                Secure Booking
              </div>
              <h1 className="text-3xl font-black mb-2 tracking-tight">Book Appointment</h1>
              <p className="text-blue-100 font-medium opacity-90">Schedule a consultation with {expertName}</p>
            </div>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl -ml-8 -mb-8" />
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
                  onChange={(val) => {
                    setSelectedDate(val);
                    if (selectedTime) setSelectedTime(''); // Reset time when date changes
                  }}
                  placeholder="Select Appointment Date"
                  minDate={new Date()}
                />
              </div>

              <div 
                onClickCapture={(e) => {
                  if (!handleTimeClick()) {
                    e.stopPropagation();
                  }
                }}
              >
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Select Time
                  </div>
                </label>
                <div className={!selectedDate ? 'opacity-50 grayscale' : ''}>
                  <CustomAnalogTimePicker 
                    value={selectedTime}
                    onChange={(val) => {
                      if (handleTimeClick()) {
                        setSelectedTime(val);
                      }
                    }}
                    placeholder={selectedDate ? "Select Appointment Time" : "Select Date First"}
                  />
                </div>
                {!selectedDate && (
                  <p className="mt-2 text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                    <AlertCircle size={10} /> Date selection required to unlock time slots
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 shadow-inner">
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
