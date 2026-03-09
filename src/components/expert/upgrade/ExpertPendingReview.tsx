'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck } from 'lucide-react';

interface ExpertPendingReviewProps {
  onReturn: () => void;
}

export const ExpertPendingReview: React.FC<ExpertPendingReviewProps> = ({ onReturn }) => {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8 py-12"
    >
      <div className="relative inline-block">
        <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 mb-6">
          <Loader2 size={48} className="animate-spin" />
        </div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-slate-50 dark:border-slate-950"
        >
          <ShieldCheck size={14} />
        </motion.div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Application Pending</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
          IKIKE Admin is currently reviewing your professional credentials. You will be notified once your 'Verified Expert' badge is awarded.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/20 max-w-sm mx-auto">
        <p className="text-amber-700 dark:text-amber-400 text-xs font-bold leading-relaxed">
          Verification usually takes 24-48 hours. Please ensure your license number is accurate to avoid delays.
        </p>
      </div>

      <button 
        onClick={onReturn}
        className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
      >
        Return to My Profile
      </button>
    </motion.div>
  );
};
