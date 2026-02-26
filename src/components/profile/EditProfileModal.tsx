'use client';

import React, { useState } from 'react';
import { User as UserIcon, Phone, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseInput } from '../common/BaseInput';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: { displayName: string; phone: string };
  onSave: (data: { displayName: string; phone: string }) => Promise<void>;
}

export default function EditProfileModal({ isOpen, onClose, initialData, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
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

                <BaseInput 
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  prefixIcon={<Phone className="w-5 h-5 text-slate-400" />}
                  placeholder="+234 ..."
                />

                <button 
                  onClick={handleSubmit}
                  disabled={processing}
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
