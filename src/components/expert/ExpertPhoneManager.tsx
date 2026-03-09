'use client';

import React from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhoneManager } from '@/hooks/usePhoneManager';
import { PhoneEntryRow } from './PhoneEntryRow';
import { AddPhoneForm } from './AddPhoneForm';

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

export const ExpertPhoneManager: React.FC<ExpertPhoneManagerProps> = ({ 
  phones, 
  onChange,
  primaryPhoneDisabled = false
}) => {
  const {
    isAdding,
    setIsAdding,
    newPhone,
    setNewPhone,
    verificationStep,
    setVerificationStep,
    otp,
    setOtp,
    isVerifying,
    error,
    maxLen,
    isLengthValid,
    handleStartAdd,
    handleSendOtp,
    handleVerifyOtp,
    removePhone,
    updatePhone,
  } = usePhoneManager(phones, onChange);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          Contact Phone Numbers <span className="text-red-500">*</span>
        </label>
      </div>
      
      <div className="space-y-3">
        {phones.map((phone, index) => (
          <PhoneEntryRow 
            key={index}
            phone={phone}
            index={index}
            totalPhones={phones.length}
            primaryPhoneDisabled={primaryPhoneDisabled}
            onRemove={removePhone}
            onUpdate={updatePhone}
          />
        ))}
      </div>

      <AnimatePresence>
        {isAdding ? (
          <AddPhoneForm 
            setIsAdding={setIsAdding}
            verificationStep={verificationStep}
            setVerificationStep={setVerificationStep}
            newPhone={newPhone}
            setNewPhone={setNewPhone}
            otp={otp}
            setOtp={setOtp}
            isVerifying={isVerifying}
            error={error}
            maxLen={maxLen}
            isLengthValid={isLengthValid}
            handleSendOtp={handleSendOtp}
            handleVerifyOtp={handleVerifyOtp}
          />
        ) : (
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartAdd}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-all px-2 py-1"
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
