import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PendingStatusStepProps {
  onReturn: () => void;
}

export const PendingStatusStep: React.FC<PendingStatusStepProps> = ({ onReturn }) => {
  return (
    <motion.div
      key="pending"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8 bg-white dark:bg-slate-900 p-12 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-3xl shadow-blue-900/5"
    >
      <div className="mx-auto w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600">
        <Loader2 size={48} className="animate-spin" />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Node Syncing</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
          Your clinical authority upgrade is being reviewed by the IKIKE Registry Board. This process typically takes 3-5 business days.
        </p>
      </div>
      <button 
        onClick={onReturn}
        className="px-10 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105"
      >
        Return to Console
      </button>
    </motion.div>
  );
};
