import React from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, AlertCircle } from 'lucide-react';
import CustomSelect from '../common/CustomSelect';
import { countries } from '@/data/countries';
import { PhoneEntry } from './ExpertPhoneManager';

interface AddPhoneFormProps {
  setIsAdding: (val: boolean) => void;
  verificationStep: 'idle' | 'otp';
  setVerificationStep: (step: 'idle' | 'otp') => void;
  newPhone: PhoneEntry;
  setNewPhone: (phone: PhoneEntry) => void;
  otp: string;
  setOtp: (otp: string) => void;
  isVerifying: boolean;
  error: string;
  maxLen: number;
  isLengthValid: boolean;
  handleSendOtp: () => void;
  handleVerifyOtp: () => void;
}

export function AddPhoneForm({
  setIsAdding,
  verificationStep,
  setVerificationStep,
  newPhone,
  setNewPhone,
  otp,
  setOtp,
  isVerifying,
  error,
  maxLen,
  isLengthValid,
  handleSendOtp,
  handleVerifyOtp,
}: AddPhoneFormProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-900/30 space-y-4"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Add New Verified Number</h4>
        <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
      </div>

      {verificationStep === 'idle' ? (
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="w-full xl:w-40 shrink-0">
            <CustomSelect
              value={`${newPhone.code}:${countries.find(c => c.code === newPhone.code)?.name}`}
              onChange={(val) => {
                const [code] = val.split(':');
                setNewPhone({ ...newPhone, code });
              }}
              options={countries.map(c => ({ 
                value: `${c.code}:${c.name}`, 
                key: `${c.code}-${c.name}`,
                label: `${c.flag} ${c.code} (${c.name.charAt(0).toUpperCase() + c.name.slice(1)})` 
              }))}
              placeholder="+1"
              className="!rounded-2xl"
            />
          </div>
          <input
            type="tel"
            value={newPhone.number}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d+]/g, '').slice(0, maxLen);
              const formatted = raw.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
              setNewPhone({ ...newPhone, number: formatted });
            }}
            placeholder="801 234 5678"
            className={`flex-1 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 outline-none font-bold text-slate-900 dark:text-white transition-all ${
              newPhone.number && !isLengthValid ? 'border-amber-200 focus:border-amber-500' : 'border-transparent focus:border-blue-500'
            }`}
          />
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendOtp}
            disabled={isVerifying || !isLengthValid}
            className="px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center min-h-[52px] xl:min-w-[140px]"
          >
            {isVerifying ? <Loader2 size={16} className="animate-spin" /> : 'Send OTP'}
          </motion.button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-500">Enter the 6-digit code sent to {newPhone.code} {newPhone.number}</p>
          <div className="flex flex-col xl:flex-row gap-3">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="flex-1 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 outline-none font-mono text-2xl tracking-[0.5em] text-center font-black"
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerifyOtp}
              disabled={isVerifying || otp.length < 6}
              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center min-h-[52px] xl:min-w-[160px]"
            >
              {isVerifying ? <Loader2 size={16} className="animate-spin" /> : 'Verify & Add'}
            </motion.button>
          </div>
          <button onClick={() => setVerificationStep('idle')} className="text-[9px] font-black uppercase text-blue-600 dark:text-blue-400 hover:underline">Change Number</button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase">
          <AlertCircle size={12} /> {error}
        </div>
      )}
    </motion.div>
  );
}
