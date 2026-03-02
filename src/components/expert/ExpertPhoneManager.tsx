'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Settings2, Check, AlertCircle, Shield, ChevronDown, Loader2, X } from 'lucide-react';
import CustomSelect from '../common/CustomSelect';
import { countries } from '@/data/countries';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '@/services/userService';

export interface PhoneEntry {
  number: string;
  code: string;
  label: string;
  isCustom?: boolean;
  isVerified?: boolean;
}

interface ExpertPhoneManagerProps {
  phones: PhoneEntry[];
  onChange: (phones: PhoneEntry[]) => void;
  primaryPhoneDisabled?: boolean;
}

const DEFAULT_LABELS = ["Office", "Mobile", "Home", "Fax", "WhatsApp", "Emergency", "Primary"];

export const ExpertPhoneManager: React.FC<ExpertPhoneManagerProps> = ({ 
  phones, 
  onChange,
  primaryPhoneDisabled = false
}) => {
  const [customLabelMode, setCustomLabelMode] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newPhone, setNewPhone] = useState<PhoneEntry>({ number: '', code: '+234', label: 'Office' });
  const [verificationStep, setVerificationStep] = useState<'idle' | 'otp'>('idle');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const getCountryByCode = (code: string) => {
    return countries.find(c => c.code === code) || countries.find(c => c.code === '+1');
  };

  const activeCountry = getCountryByCode(newPhone.code);
  const minLen = activeCountry?.min || 7;
  const maxLen = activeCountry?.max || 15;
  const isLengthValid = newPhone.number.replace(/\s/g, '').length >= minLen;

  const handleStartAdd = () => {
    setIsAdding(true);
    setVerificationStep('idle');
    setNewPhone({ number: '', code: '+234', label: 'Office' });
    setError('');
  };

  const handleSendOtp = async () => {
    const rawNumber = newPhone.number.replace(/\s/g, '');
    if (!rawNumber) {
      setError('Please enter a phone number');
      return;
    }

    if (rawNumber.length < minLen) {
      setError(`Phone number too short for ${activeCountry?.name || 'this country'}. Min ${minLen} digits.`);
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const fullNumber = `${newPhone.code}${rawNumber}`;
      
      // 1. Check uniqueness in DB
      const isTaken = await userService.isPhoneTaken(fullNumber);
      if (isTaken) {
        setError('number in use already');
        setIsVerifying(false);
        return;
      }

      // 2. Check locally if already in the expert's list
      if (phones.some(p => p.code === newPhone.code && p.number.replace(/\s/g, '') === rawNumber)) {
        setError('number in use already');
        setIsVerifying(false);
        return;
      }

      // 3. Mock OTP Send
      setTimeout(() => {
        setIsVerifying(false);
        setVerificationStep('otp');
      }, 1500);
    } catch (e) {
      console.error(e);
      setError('Connection error. Please try again.');
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp === '123456') { // Demo OTP
      setIsVerifying(true);
      setTimeout(() => {
        onChange([...phones, { ...newPhone, isVerified: true }]);
        setIsAdding(false);
        setIsVerifying(false);
        setOtp('');
      }, 1000);
    } else {
      setError('Invalid OTP. Use 123456 for demo.');
    }
  };

  const removePhone = (index: number) => {
    if (phones.length <= 1) {
      setError('You must have at least one verified phone number.');
      return;
    }
    onChange(phones.filter((_, i) => i !== index));
  };

  const updatePhone = (index: number, updates: Partial<PhoneEntry>) => {
    const newPhones = [...phones];
    newPhones[index] = { ...newPhones[index], ...updates };
    onChange(newPhones);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          Contact Phone Numbers <span className="text-red-500">*</span>
        </label>
      </div>
      
      <div className="space-y-3">
        {phones.map((phone, index) => {
          const selectedCountry = getCountryByCode(phone.code);
          const maxLen = selectedCountry?.max || 15;
          const isPrimary = index === 0 && primaryPhoneDisabled;

          return (
            <div 
              key={index} 
              className={`group relative flex flex-col xl:flex-row items-stretch xl:items-center rounded-2xl border transition-all duration-300 ${
                isPrimary 
                  ? 'border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 shadow-sm' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Label Section */}
              <div className="w-full xl:w-32 2xl:w-40 p-1 border-b xl:border-b-0 xl:border-r border-slate-100 dark:border-slate-800 shrink-0">
                <div className="relative group/label">
                  <select
                    value={phone.label}
                    disabled={true} // Always disabled for existing numbers
                    onChange={(e) => updatePhone(index, { label: e.target.value })}
                    className="w-full h-10 md:h-12 px-4 text-[10px] sm:text-xs font-black uppercase tracking-wider bg-transparent border-none focus:ring-0 outline-none text-slate-600 dark:text-slate-300 cursor-pointer disabled:cursor-not-allowed appearance-none"
                  >
                    {DEFAULT_LABELS.map(l => <option key={l} value={l} className="font-bold text-slate-700 dark:bg-slate-900">{l}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none opacity-0 transition-colors" />
                </div>
              </div>

              {/* Country Code Section */}
              <div className="w-full xl:w-32 2xl:w-40 border-b xl:border-b-0 xl:border-r border-slate-100 dark:border-slate-800 shrink-0">
                <CustomSelect
                  // Try to find a matching country by code to provide a unique value to CustomSelect
                  value={countries.find(c => c.code === phone.code)?.code + ":" + countries.find(c => c.code === phone.code)?.name}
                  disabled={true} // Always disabled for existing numbers
                  onChange={(val) => {
                    const [code] = val.split(':');
                    updatePhone(index, { code });
                  }}
                  options={countries.map(c => ({ 
                    value: `${c.code}:${c.name}`, 
                    key: `${c.code}-${c.name}`,
                    label: `${c.flag} ${c.code} (${c.name.charAt(0).toUpperCase() + c.name.slice(1)})` 
                  }))}
                  placeholder="+1"
                  className="h-10 md:h-12 border-none bg-transparent shadow-none hover:border-none focus:ring-0 px-4 text-xs sm:text-sm font-bold"
                  optionClassName="text-xs"
                />
              </div>

              {/* Number Section */}
              <div className="flex-1 relative flex items-center min-w-0">
                <input
                  type="tel"
                  value={phone.number}
                  disabled={true} // Always disabled for existing numbers
                  suppressHydrationWarning
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d+]/g, '').slice(0, maxLen);
                    const formatted = raw.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
                    updatePhone(index, { number: formatted });
                  }}
                  placeholder="801 234 5678"
                  className="w-full h-10 md:h-12 px-5 bg-transparent border-none focus:ring-0 outline-none text-sm sm:text-base font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 min-w-0 tracking-wider"
                />
                
                <div className="absolute right-2 md:right-4 flex items-center gap-2 sm:gap-3 shrink-0">
                  {phone.isVerified && (
                    <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-blue-600 rounded-full shadow-lg shadow-blue-200/50">
                       <Shield size={10} className="text-white" />
                       <span className="text-[7px] sm:text-[8px] font-black text-white uppercase tracking-tighter">Verified</span>
                    </div>
                  )}
                  
                  {phones.length > 1 && (
                    <button 
                      onClick={() => removePhone(index)}
                      className="p-1 sm:p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {isAdding ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-900/30 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600">Add New Verified Number</h4>
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
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center min-h-[52px] xl:min-w-[140px]"
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
                <button onClick={() => setVerificationStep('idle')} className="text-[9px] font-black uppercase text-blue-600 hover:underline">Change Number</button>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase">
                <AlertCircle size={12} /> {error}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartAdd}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-all px-2 py-1"
          >
            <div className="p-1 bg-blue-50 group-hover:bg-blue-100 rounded-lg transition-colors">
              <Plus size={12} />
            </div>
            Add Phone Number
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
