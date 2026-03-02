'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, FileText, Building2, ShieldCheck, Award, Loader2, Check, X, Plus, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ExpertDetailsStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function ExpertDetailsStep({ formData, setFormData }: ExpertDetailsStepProps) {
  const t = useTranslations('onboarding.expert');
  const [newSpecialty, setNewSpecialty] = useState('');

  const addSpecialty = () => {
    if (!newSpecialty) return;
    const specialties = [...(formData.expert?.specialties || [])];
    if (!specialties.includes(newSpecialty)) {
      specialties.push(newSpecialty);
      setFormData({ ...formData, expert: { ...formData.expert, specialties } });
    }
    setNewSpecialty('');
  };

  const removeSpecialty = (s: string) => {
    const specialties = formData.expert?.specialties?.filter((item: string) => item !== s) || [];
    setFormData({ ...formData, expert: { ...formData.expert, specialties } });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="space-y-10"
    >
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 shadow-sm">
          <Stethoscope size={12} />
          Expert Verification
        </div>
        
        <div className="space-y-1">
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Credentialing <span className="text-blue-600">&</span> Experience.
          </h3>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            Register your clinical qualifications to join our verified professional registry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* License Number */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
            <FileText size={14} /> License Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.expert?.licenseNumber || ''}
            onChange={(e) => setFormData({ ...formData, expert: { ...formData.expert, licenseNumber: e.target.value } })}
            placeholder="e.g. MED-9920334"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-sm"
          />
        </div>

        {/* Years of Experience */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
            <Award size={14} /> Clinical Experience <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.expert?.yearsOfExperience || ''}
            onChange={(e) => setFormData({ ...formData, expert: { ...formData.expert, yearsOfExperience: e.target.value } })}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-sm cursor-pointer appearance-none"
          >
            <option value="" disabled>Select years</option>
            <option value="1-3">1 - 3 Years</option>
            <option value="4-7">4 - 7 Years</option>
            <option value="8-12">8 - 12 Years</option>
            <option value="13+">13+ Years</option>
          </select>
        </div>

        {/* Institution Name (Optional) */}
        <div className="md:col-span-2 space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
            <Building2 size={14} /> Primary Institution / Clinic
          </label>
          <input
            type="text"
            value={formData.expert?.institutionName || ''}
            onChange={(e) => setFormData({ ...formData, expert: { ...formData.expert, institutionName: e.target.value } })}
            placeholder="e.g. City General Hospital or Private Practice"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-sm"
          />
        </div>

        {/* Specialties Multi-Select */}
        <div className="md:col-span-2 space-y-6">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
            <Sparkles size={14} /> Domain Expertise <span className="text-red-500">*</span>
          </label>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder="e.g. Cardiology, Neurology..."
              className="flex-1 px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-sm"
            />
            <button
              onClick={addSpecialty}
              type="button"
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Add Domain
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {formData.expert?.specialties?.map((s: string) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-800 text-[10px] font-black uppercase tracking-widest"
                >
                  {s}
                  <button onClick={() => removeSpecialty(s)} className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md">
                    <X size={12} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-900 dark:bg-black rounded-[32px] text-white flex gap-4">
        <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-white/60 font-medium leading-relaxed">
          Assigned specialties and license credentials undergo cross-verification with medical councils to maintain platform integrity.
        </p>
      </div>
    </motion.div>
  );
}
