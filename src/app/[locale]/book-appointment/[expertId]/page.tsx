'use client';

import React, { useState, useEffect } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, CheckCircle, AlertCircle, ShieldAlert, Loader2 } from 'lucide-react';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import CustomTimePicker from '@/components/common/CustomTimePicker';
import NiceModal from '@/components/common/NiceModal';
import { bookingSessionService, BookingSession } from '@/services/bookingSessionService';

export default function BookingPage({ params }: { params: Promise<{ expertId: string }> }) {
  const resolvedParams = React.use(params);
  const { expertId: sessionId } = resolvedParams; // expertId in route is now our sessionId
  
  const [session, setSession] = useState<BookingSession | null>(null);
  const [validating, setValidating] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info' | 'payment';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const router = useRouter();
  
  // Only initialize booking hook if we have a valid session
  const { bookAppointment, isLoading } = useBooking(
    session?.expertId || '', 
    session?.expertName || 'Expert'
  );
  
  const consultationFee = 2500;

  useEffect(() => {
    async function validateSession() {
      const validSession = await bookingSessionService.getValidSession(sessionId);
      if (!validSession) {
        setValidating(false);
        return;
      }
      setSession(validSession);
      setValidating(false);
    }
    validateSession();
  }, [sessionId]);

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' | 'payment' = 'info', onConfirm?: () => void) => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type,
      onConfirm
    });
  };

  const handleTimeClick = () => {
    if (!selectedDate) {
      showAlert('Date Required', 'Please select an appointment date before choosing a time slot.', 'warning');
      return false;
    }
    return true;
  };

  const executeBooking = async () => {
    if (!session) return;
    setModalConfig(prev => ({ ...prev, isOpen: false }));
    try {
      await bookAppointment(selectedDate, selectedTime);
      showAlert('Booking Successful', `Your appointment with ${session.expertName} has been requested for ${selectedDate} at ${selectedTime}.`, 'success');
      setTimeout(() => router.push('/appointments'), 2000);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not authenticated') {
         showAlert('Authentication Required', 'You must be logged in to book an appointment.', 'info');
         setTimeout(() => router.push('/auth/signin'), 2000);
      } else {
         showAlert('Booking Failed', 'We could not process your request. Please try again.', 'warning');
      }
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      showAlert('Date Missing', 'Please select a valid date for your consultation.', 'warning');
      return;
    }
    if (!selectedTime) {
      showAlert('Time Missing', 'Please select a preferred time slot.', 'warning');
      return;
    }

    showAlert(
      'Confirm Consultation', 
      `You are about to book a consultation with ${session?.expertName}. A fee of ₦${consultationFee.toLocaleString()} will be charged to your account.`,
      'payment',
      executeBooking
    );
  };

  if (validating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verifying Secure Link</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-red-600">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Link Expired</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">This secure booking link has expired or is invalid. Please return to the specialist directory to initialize a new session.</p>
          <button 
            onClick={() => router.push('/directory')}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 sm:pt-40 pb-12 px-4 transition-colors duration-200">
      <NiceModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        confirmText={modalConfig.type === 'payment' ? "Pay & Confirm" : "Got it"}
        isLoading={isLoading}
      />

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
                Secure Booking Session
              </div>
              <h1 className="text-3xl font-black mb-2 tracking-tight">Book Appointment</h1>
              <p className="text-blue-100 font-medium opacity-90">Schedule a consultation with {session.expertName}</p>
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
                    if (selectedTime) setSelectedTime(''); 
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
                  <CustomTimePicker 
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
              <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Secure Session ID: <span className="font-mono text-slate-300">{sessionId.substring(0, 8)}...</span>
                </p>
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-wider text-center">
                  Secured by Ikiké Health Payment Protocol. <br />
                  Refunds available up to 24h before appointment.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
