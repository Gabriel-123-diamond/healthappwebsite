import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, X, Award } from 'lucide-react';

interface SpecialtyListProps {
  specialties: { name: string, years: string }[];
  handleUpdate: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
  removeSpecialty: (name: string) => void;
  pendingSpecialty: string | null;
}

export function SpecialtyList({
  specialties,
  handleUpdate,
  validationErrors,
  removeSpecialty,
  pendingSpecialty,
}: SpecialtyListProps) {
  return (
    <div className="space-y-4 pt-4">
      <AnimatePresence mode="popLayout">
        {specialties.map((s: { name: string, years: string }, index: number) => (
          <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            key={s.name}
            className={`group flex items-center justify-between p-5 rounded-[32px] border transition-all duration-300 ${
              index === 0 
                ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-sm' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl shadow-sm ${
                index === 0 ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              }`}>
                <Stethoscope size={20} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{s.name}</span>
                  {index === 0 && (
                    <span className="text-[7px] font-black bg-blue-600 dark:bg-blue-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Primary</span>
                  )}
                </div>
                <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">{s.years} Years of Experience</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {index !== 0 && (
                <button 
                  onClick={() => {
                    const newSpecs = [s, ...specialties.filter((spec: any) => spec.name !== s.name)];
                    handleUpdate('specialties', newSpecs);
                    handleUpdate('specialty', s.name);
                  }}
                  className="p-2 text-[8px] font-black uppercase text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                >
                  Set Primary
                </button>
              )}
              <button 
                onClick={() => removeSpecialty(s.name)}
                className={`p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all ${index === 0 ? '' : 'opacity-0 group-hover:opacity-100'}`}
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {specialties.length === 0 && !pendingSpecialty && (
        <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[40px] bg-slate-50/50 dark:bg-slate-800/20 shadow-inner">
          <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
            <Award size={32} />
          </div>
          <p className="text-xs text-slate-400 font-bold italic tracking-tight uppercase">No assigned expertise yet</p>
        </div>
      )}
      
      {validationErrors.specialties && <p className="text-[10px] text-red-500 font-black uppercase mt-2 ml-1 tracking-widest">{validationErrors.specialties}</p>}
    </div>
  );
}
