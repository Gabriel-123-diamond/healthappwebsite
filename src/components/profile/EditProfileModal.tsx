'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Phone, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseInput } from '../common/BaseInput';
import { userService } from '@/services/userService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: { displayName: string; phone: string };
  onSave: (data: { displayName: string; phone: string }) => Promise<void>;
}

export default function EditProfileModal({ isOpen, onClose, initialData, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [processing, setProcessing] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  useEffect(() => {
    if (formData.phone === initialData.phone || formData.phone.length < 5) {
      setPhoneStatus('idle');
      return;
    }
    setPhoneStatus('checking');
    const tid = setTimeout(async () => {
      try {
        const available = await userService.checkAvailability('phone', formData.phone.trim());
        setPhoneStatus(available ? 'available' : 'taken');
      } catch (e) {
        setPhoneStatus('idle');
      }
    }, 500);
    return () => clearTimeout(tid);
  }, [formData.phone, initialData.phone]);

  const handleSubmit = async () => {
    if (phoneStatus === 'taken') return;
    setProcessing(true);
    await onSave(formData);
    setProcessing(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-white dark:border-slate-800"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Edit Profile</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <BaseInput 
                  id="displayName"
                  label="Full Name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  prefixIcon={<UserIcon className="w-5 h-5 text-slate-400" />}
                  placeholder="Your full name"
                />

                <div className="relative group">
                  <BaseInput 
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    prefixIcon={<Phone className="w-5 h-5 text-slate-400" />}
                    placeholder="+234 ..."
                    className={phoneStatus === 'taken' ? 'border-red-500 ring-2 ring-red-100' : ''}
                  />
                  <div className="absolute right-4 top-[52px] flex items-center gap-2">
                    {phoneStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                    {phoneStatus === 'available' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {phoneStatus === 'taken' && <AlertCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  {phoneStatus === 'taken' && (
                    <p className="text-[10px] font-black text-red-500 uppercase mt-2 ml-2 tracking-widest">number in use already</p>
                  )}
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={processing || phoneStatus === 'taken'}
                  className="w-full bg-slate-900 dark:bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-slate-200 dark:disabled:bg-slate-800"
                >
                  {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
