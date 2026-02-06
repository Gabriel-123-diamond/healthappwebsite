'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Ticket, Loader2, Check, X } from 'lucide-react';

interface ReferralStepProps {
  formData: any;
  setFormData: (data: any) => void;
  validationStatus: any;
}

export default function ReferralStep({ formData, setFormData, validationStatus }: ReferralStepProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 sm:space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 sm:p-6 bg-blue-50 rounded-2xl sm:rounded-[32px] text-blue-600">
          <Gift size={32} className="sm:w-12 sm:h-12" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 sm:mb-2">Have a referral code?</h3>
          <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-sm mx-auto px-4">Enter it below to earn rewards and connect with your friend. You can skip this if you don't have one.</p>
        </div>
      </div>
      
      <div className="space-y-2 max-w-md mx-auto w-full px-4 sm:px-0">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">Referral Code</label>
        <div className="relative group">
          <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-50 group-focus-within:bg-blue-50 transition-colors">
            <Ticket className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
          </div>
          <input 
            type="text" 
            value={formData.referralCode}
            onChange={(e) => setFormData({...formData, referralCode: e.target.value.toUpperCase().trim()})}
            className={`w-full pl-12 sm:pl-16 pr-10 sm:pr-12 py-4 sm:py-5 rounded-xl sm:rounded-[24px] bg-white border outline-none transition-all font-black text-slate-900 shadow-sm placeholder:font-normal placeholder:text-slate-400 text-sm sm:text-base ${
              validationStatus.referral === 'invalid' ? 'border-red-500 focus:ring-red-200' : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/5'
            }`}
            placeholder="REF-XXXXXXX"
          />
          <div className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2">
            {validationStatus.referral === 'validating' && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-500" />}
            {validationStatus.referral === 'valid' && <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-2 h-2 sm:w-3 sm:h-3 text-emerald-600" /></div>}
            {validationStatus.referral === 'invalid' && <div className="p-1 bg-red-100 rounded-full"><X className="w-2 h-2 sm:w-3 sm:h-3 text-red-600" /></div>}
          </div>
        </div>
        {validationStatus.referralError && <p className="text-[10px] sm:text-xs text-red-500 font-bold text-center mt-2">{validationStatus.referralError}</p>}
        <p className="text-[10px] text-slate-400 font-bold text-center mt-4">LEAVE BLANK IF NONE</p>
      </div>
    </motion.div>
  );
}
