'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Stethoscope, Leaf, Building2, ChevronRight, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface RoleStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function RoleStep({ formData, setFormData }: RoleStepProps) {
  const t = useTranslations('onboarding.role');

  const roles = [
    { id: 'user', icon: <UserCircle className="w-6 h-6" />, title: t('user'), desc: t('userDesc'), color: 'blue' },
    { id: 'doctor', icon: <Stethoscope className="w-6 h-6" />, title: t('doctor'), desc: t('doctorDesc'), color: 'indigo' },
    { id: 'herbal_practitioner', icon: <Leaf className="w-6 h-6" />, title: t('herbal'), desc: t('herbalDesc'), color: 'emerald' },
    { id: 'hospital', icon: <Building2 className="w-6 h-6" />, title: t('hospital'), desc: t('hospitalDesc'), color: 'purple' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.05 }} 
      className="space-y-10"
    >
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 shadow-sm">
          <ShieldCheck size={12} />
          Protocol Selection
        </div>
        
        <div className="space-y-1">
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            {t('title')}
          </h3>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {roles.map((role) => {
          const isSelected = formData.role === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setFormData({ ...formData, role: role.id })}
              className={`flex items-start gap-5 p-6 sm:p-8 rounded-[32px] border-2 text-left transition-all duration-500 relative group ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-blue-500/30'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-500 ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600'
              }`}>
                {role.icon}
              </div>
              <div className="space-y-1">
                <h4 className={`text-lg font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {role.title}
                </h4>
                <p className={`text-xs font-medium leading-relaxed ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {role.desc}
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-6 right-6">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg">
                    <ChevronRight size={14} strokeWidth={4} />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
