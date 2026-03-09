'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Building2, Leaf, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserRole } from '@/types';

interface ExpertRoleStepProps {
  formData: {
    role: UserRole;
  };
  setFormData: (data: any) => void;
  onNext: () => void;
}

const expertTypes = [
  { id: 'doctor', title: 'Medical Doctor', icon: Stethoscope, desc: 'Licensed MDs, Specialists, and Surgeons' },
  { id: 'hospital', title: 'Healthcare Facility', icon: Building2, desc: 'Clinics, Hospitals, and Diagnostic Centers' },
  { id: 'herbal_practitioner', title: 'Traditional Expert', icon: Leaf, desc: 'Herbal Medicine and Natural Health Practitioners' },
];

export const ExpertRoleStep: React.FC<ExpertRoleStepProps> = ({ formData, setFormData, onNext }) => {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Choose Your Professional Identity</h2>
      <div className="grid grid-cols-1 gap-4">
        {expertTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setFormData({ ...formData, role: type.id as UserRole })}
            className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left group ${
              formData.role === type.id 
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' 
                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-200'
            }`}
          >
            <div className={`p-4 rounded-2xl transition-all ${
              formData.role === type.id ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600'
            }`}>
              <type.icon size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">{type.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{type.desc}</p>
            </div>
            {formData.role === type.id && (
              <div className="ml-auto">
                <CheckCircle2 className="text-blue-600" />
              </div>
            )}
          </button>
        ))}
      </div>
      <button 
        onClick={onNext}
        className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl transition-transform hover:scale-[1.02] active:scale-95"
      >
        Continue to Verification <ArrowRight size={16} />
      </button>
    </motion.div>
  );
};
