import React from 'react';
import { ArrowLeft, CheckCircle, ShieldAlert, Loader2, Calendar, Clock, AlertCircle } from 'lucide-react';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import CustomTimePicker from '@/components/common/CustomTimePicker';

export const LoadingSessionState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verifying Secure Link</p>
  </div>
);

export const ExpiredSessionState = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
    <div className="bg-white dark:bg-slate-900 p-12 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 text-center max-w-md w-full">
      <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-red-600">
        <ShieldAlert size={40} />
      </div>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Link Expired</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">This secure booking link has expired or is invalid. Please return to the specialist directory to initialize a new session.</p>
      <button 
        onClick={onBack}
        className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
      >
        Back to Directory
      </button>
    </div>
  </div>
);

export const BookingHeader = ({ expertName }: { expertName: string }) => (
  <div className="bg-blue-600 p-10 text-white relative overflow-hidden">
    <div className="relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
        <CheckCircle size={12} />
        Secure Booking Session
      </div>
      <h1 className="text-3xl font-black mb-2 tracking-tight">Book Appointment</h1>
      <p className="text-blue-100 font-medium opacity-90">Schedule a consultation with {expertName}</p>
    </div>
    {/* Background Decor */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl -ml-8 -mb-8" />
  </div>
);

export const BookingForm = ({
  selectedDate, setSelectedDate,
  selectedTime, setSelectedTime,
  handleTimeClick,
  onSubmit,
  isLoading,
  consultationFee,
  sessionId
}: {
  selectedDate: string, setSelectedDate: (v: string) => void,
  selectedTime: string, setSelectedTime: (v: string) => void,
  handleTimeClick: () => boolean,
  onSubmit: (e: React.FormEvent) => void,
  isLoading: boolean,
  consultationFee: number,
  sessionId: string
}) => (
  <form onSubmit={onSubmit} className="p-10 space-y-8">
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
        className="w-full py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-slate-200 dark:shadow-none"
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
);
