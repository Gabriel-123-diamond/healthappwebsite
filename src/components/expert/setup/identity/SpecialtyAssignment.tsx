import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X } from 'lucide-react';

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
  return (
    <AnimatePresence mode="wait">
      {pendingSpecialty && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="p-6 rounded-[32px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
             <Sparkles size={80} />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Assign Experience To</p>
              {pendingSpecialty === 'Other' ? (
                <input 
                  autoFocus
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Type Specialty Name..."
                  className="bg-transparent border-b-2 border-slate-700 dark:border-slate-300 outline-none text-xl font-black placeholder:opacity-30 w-full"
                />
              ) : (
                <h4 className="text-xl font-black tracking-tight">{pendingSpecialty}</h4>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center px-4 py-2 bg-white/10 dark:bg-slate-900/10 rounded-2xl border border-white/20 dark:border-slate-900/20">
                <span className="text-[8px] font-black uppercase tracking-tighter mb-1">Years</span>
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
                className="p-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl shadow-xl flex items-center justify-center disabled:opacity-50 disabled:scale-95 transition-all"
              >
                <Check size={24} strokeWidth={4} />
              </motion.button>

              <button 
                onClick={() => setPendingSpecialty(null)}
                className="p-2 opacity-50 hover:opacity-100 transition-opacity"
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
