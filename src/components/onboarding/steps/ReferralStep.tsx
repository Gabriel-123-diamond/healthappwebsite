'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Ticket, Loader2, Check, X, Sparkles } from 'lucide-react';

interface ReferralStepProps {
  formData: any;
  setFormData: (data: any) => void;
  validationStatus: any;
}

export default function ReferralStep({ formData, setFormData, validationStatus }: ReferralStepProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative">
          <div className="p-8 sm:p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] text-white relative z-10 shadow-2xl shadow-blue-500/20 rotate-3">
            <Gift size={48} strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 bg-blue-400/30 blur-3xl rounded-full transform scale-150 -z-0" />
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-2 -right-4 p-2 bg-amber-400 rounded-2xl shadow-lg z-20"
          >
            <Sparkles size={16} className="text-white" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
            Step 1: Referral
          </div>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Got a code?</h3>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
            Connect with friends and unlock early-access rewards.
          </p>
        </div>
      </div>
      
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white dark:bg-slate-900/50 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Referral Code</label>
              <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest italic">Optional</span>
            </div>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Ticket size={20} />
              </div>
              <input 
                type="text" 
                value={formData.referralCode}
                onChange={(e) => setFormData({...formData, referralCode: e.target.value.toUpperCase().trim()})}
                className={`w-full pl-14 pr-12 py-5 rounded-[24px] bg-slate-50 dark:bg-slate-800 border-2 outline-none transition-all font-black tracking-widest text-slate-900 dark:text-white placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 ${
                  validationStatus.referral === 'invalid' ? 'border-red-500 focus:bg-white' : 'border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900'
                }`}
                placeholder="REF-XXXXXXX"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2">
                {validationStatus.referral === 'validating' && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                {validationStatus.referral === 'valid' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 bg-emerald-500 rounded-full">
                    <Check className="w-3 h-3 text-white" strokeWidth={4} />
                  </motion.div>
                )}
                {validationStatus.referral === 'invalid' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 bg-red-500 rounded-full">
                    <X className="w-3 h-3 text-white" strokeWidth={4} />
                  </motion.div>
                )}
              </div>
            </div>
            {validationStatus.referralError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center">
                {validationStatus.referralError}
              </motion.p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Don't have one? Just click continue
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
