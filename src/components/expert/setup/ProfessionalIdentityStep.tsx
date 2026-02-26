'use client';

import React from 'react';
import { User, ShieldCheck, AlertCircle, ChevronRight, Loader2, Award, Plus, X } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import { ExpertPhoneManager } from '@/components/expert/ExpertPhoneManager';
import CustomSelect from '@/components/common/CustomSelect';
import { ALL_SPECIALTIES } from '@/data/specialties';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfessionalIdentityStepProps {
  formData: any;
  handleUpdate: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
  userProfile: any;
  onRevert: () => void;
  isReverting: boolean;
}

export const ProfessionalIdentityStep: React.FC<ProfessionalIdentityStepProps> = ({
  formData,
  handleUpdate,
  validationErrors,
  userProfile,
  onRevert,
  isReverting
}) => {
  const addSpecialty = (name: string) => {
    if (!name || formData.specialties.some((s: any) => s.name === name)) return;
    handleUpdate('specialties', [...formData.specialties, { name, years: '' }]);
  };

  const removeSpecialty = (name: string) => {
    handleUpdate('specialties', formData.specialties.filter((s: any) => s.name !== name));
  };

  const updateSpecialtyYears = (name: string, years: string) => {
    handleUpdate('specialties', formData.specialties.map((s: any) => 
      s.name === name ? { ...s, years } : s
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 min-h-[700px]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <User className="w-5 h-5 text-blue-600" /> 
          Professional Identity
        </h3>
        
        {/* Expert Type Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-black uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {formData.expertType}
          </span>
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
         <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5" />
         <div className="flex-1">
           <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight leading-relaxed mb-2">
             Professional type is locked based on your registration.
           </p>
           <motion.button 
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRevert}
              disabled={isReverting}
              className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 disabled:opacity-50"
           >
             {isReverting ? (
               <><Loader2 className="w-2.5 h-2.5 animate-spin" /> Resetting...</>
             ) : (
               <>Revert to sign-up <ChevronRight size={10} /></>
             )}
           </motion.button>
         </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-2">
            <Award size={14} /> My Specialized Areas <span className="text-red-500">*</span>
          </label>
          
          <div className="space-y-3">
            <AnimatePresence>
              {formData.specialties.map((s: { name: string, years: string }) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  key={s.name}
                  className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex-1 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                      <Award size={16} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{s.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input 
                        type="number"
                        value={s.years}
                        onChange={(e) => updateSpecialtyYears(s.name, e.target.value)}
                        placeholder="Years"
                        className="w-24 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-blue-500 outline-none text-xs font-black text-center"
                      />
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Experience</span>
                    </div>
                    
                    <button 
                      onClick={() => removeSpecialty(s.name)}
                      className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {formData.specialties.length === 0 && (
              <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
                <p className="text-sm text-slate-400 font-medium italic">No specialties added yet. Use the selector below.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 space-y-4">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em] mb-3 block">Add Another Specialty</label>
            <CustomSelect
              options={ALL_SPECIALTIES.map(s => ({ value: s, label: s }))}
              value={formData.currentSpecialtySelection || ""}
              onChange={(val) => {
                if (val === 'Other') {
                  handleUpdate('showCustomSpecialty', true);
                  handleUpdate('currentSpecialtySelection', 'Other');
                } else {
                  addSpecialty(val);
                  handleUpdate('currentSpecialtySelection', "");
                  handleUpdate('showCustomSpecialty', false);
                }
              }}
              placeholder="Search through 200+ specialties..."
              className="!py-3 !text-xs"
            />

            {formData.showCustomSpecialty && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                <BaseInput
                  id="customSpecialtyInput"
                  label="Enter Custom Specialty"
                  value={formData.customSpecialtyName || ''}
                  onChange={(e) => handleUpdate('customSpecialtyName', e.target.value)}
                  placeholder="e.g. Traditional Bone Setter"
                  className="flex-1"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (formData.customSpecialtyName) {
                      addSpecialty(formData.customSpecialtyName);
                      handleUpdate('customSpecialtyName', '');
                      handleUpdate('showCustomSpecialty', false);
                      handleUpdate('currentSpecialtySelection', '');
                    }
                  }}
                  className="mt-6 px-6 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  Add
                </motion.button>
              </motion.div>
            )}

            {validationErrors.specialties && <p className="text-xs text-red-500 font-bold mt-2 ml-1">{validationErrors.specialties}</p>}
          </div>
        </div>
      </div>

      <ExpertPhoneManager 
        phones={formData.phones} 
        onChange={(p) => handleUpdate('phones', p)}
        primaryPhoneDisabled={true}
      />
      {validationErrors.phones && <p className="text-xs text-red-500 -mt-2">{validationErrors.phones}</p>}
      
      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800">
        <p className="text-xs font-bold text-blue-800 dark:text-blue-300 leading-relaxed">
          Step 1 establishes your core identity. Your detailed bio, languages, and specific areas of expertise will be configured in Step 6.
        </p>
      </div>
    </div>
  );
};
