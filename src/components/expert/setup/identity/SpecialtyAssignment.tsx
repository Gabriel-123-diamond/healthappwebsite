import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SpecialtyAssignmentProps {
  pendingSpecialty: string | null;
  setPendingSpecialty: (val: string | null) => void;
  pendingYears: string;
  setPendingYears: (val: string) => void;
  customName: string;
  setCustomName: (val: string) => void;
  handleAssign: () => void;
}

export function SpecialtyAssignment({
  pendingSpecialty,
  setPendingSpecialty,
  pendingYears,
  setPendingYears,
  customName,
  setCustomName,
  handleAssign,
}: SpecialtyAssignmentProps) {
  const t = useTranslations('onboarding.kyc');

  return (
    <AnimatePresence mode="wait">
      {pendingSpecialty && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="p-6 rounded-[32px] bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white border-2 border-blue-500/20 shadow-2xl space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 text-blue-500">
             <Sparkles size={80} />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">{t('specialization')}</p>
              {pendingSpecialty === 'Other' ? (
                <input 
                  autoFocus
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Type Specialty Name..."
                  className="bg-transparent border-b-2 border-slate-200 dark:border-slate-700 outline-none text-xl font-black placeholder:opacity-30 w-full focus:border-blue-500 transition-colors"
                />
              ) : (
                <h4 className="text-xl font-black tracking-tight">{pendingSpecialty}</h4>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
                <span className="text-[8px] font-black uppercase tracking-tighter mb-1 text-slate-400">{t('years')}</span>
                <input 
                  type="number"
                  autoFocus={pendingSpecialty !== 'Other'}
                  value={pendingYears}
                  onChange={(e) => setPendingYears(e.target.value)}
                  placeholder="0"
                  className="w-12 bg-transparent outline-none text-center text-lg font-black"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAssign}
                disabled={!pendingYears || (pendingSpecialty === 'Other' && !customName)}
                className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center disabled:opacity-50 disabled:scale-95 transition-all"
              >
                <Check size={24} strokeWidth={4} />
              </motion.button>

              <button 
                onClick={() => setPendingSpecialty(null)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
