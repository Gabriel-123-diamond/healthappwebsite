'use client';

import React, { useState, useEffect } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { useRouter } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import NiceModal from '@/components/common/NiceModal';
import { bookingSessionService, BookingSession } from '@/services/bookingSessionService';
import { paymentService } from '@/services/paymentService';
import { auth } from '@/lib/firebase';
import { 
  LoadingSessionState, ExpiredSessionState, BookingHeader, BookingForm 
} from '@/components/booking/BookingComponents';

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
    if (!session || !auth.currentUser) return;
    setModalConfig(prev => ({ ...prev, isOpen: false }));
    
    try {
      // 1. Process Payment First
      await new Promise((resolve, reject) => {
        paymentService.initializePayment({
          email: auth.currentUser?.email || '',
          amount: consultationFee,
          metadata: {
            uid: auth.currentUser?.uid,
            expertId: session.expertId,
            type: 'appointment',
            date: selectedDate,
            time: selectedTime
          },
          onSuccess: (response) => {
            console.log("Appointment payment successful", response);
            resolve(response);
          },
          onClose: () => {
            reject(new Error("Payment cancelled"));
          }
        });
      });

      // 2. Finalize booking in database
      await bookAppointment(selectedDate, selectedTime);
      showAlert('Booking Successful', `Your appointment with ${session.expertName} has been requested for ${selectedDate} at ${selectedTime}.`, 'success');
      setTimeout(() => router.push('/appointments'), 2000);
    } catch (error: any) {
      if (error.message === "Payment cancelled") return;
      
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
    return <LoadingSessionState />;
  }

  if (!session) {
    return <ExpiredSessionState onBack={() => router.push('/directory')} />;
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
          <BookingHeader expertName={session.expertName} />

          <BookingForm
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            handleTimeClick={handleTimeClick}
            onSubmit={handleBook}
            isLoading={isLoading}
            consultationFee={consultationFee}
            sessionId={sessionId}
          />
        </div>
      </div>
    </div>
  );
}
