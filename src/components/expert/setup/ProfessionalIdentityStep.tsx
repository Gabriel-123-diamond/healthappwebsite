'use client';

import React, { useState } from 'react';
import { User, ShieldCheck, AlertCircle, ChevronRight, Loader2, Award, Plus, X, Check, Stethoscope, Sparkles, MapPin, Calendar, Languages } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import { ExpertPhoneManager } from '@/components/expert/ExpertPhoneManager';
import CustomSelect from '@/components/common/CustomSelect';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import { ALL_SPECIALTIES, MEDICAL_SPECIALTIES, TRADITIONAL_SPECIALTIES } from '@/data/specialties';
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
  const [pendingSpecialty, setPendingSpecialty] = useState<string | null>(null);
  const [pendingYears, setPendingYears] = useState('');
  const [customName, setCustomName] = useState('');

  const specialties = formData.specialties || [];

  const handleAssign = () => {
    const name = pendingSpecialty === 'Other' ? customName : pendingSpecialty;
    if (!name || !pendingYears || specialties.some((s: any) => s.name === name)) return;

    const newSpecialties = [...specialties, { name, years: pendingYears }];
    handleUpdate('specialties', newSpecialties);
    handleUpdate('specialty', newSpecialties[0]?.name || '');
    
    setPendingSpecialty(null);
    setPendingYears('');
    setCustomName('');
  };

  const removeSpecialty = (name: string) => {
    const newSpecialties = specialties.filter((s: any) => s.name !== name);
    handleUpdate('specialties', newSpecialties);
    handleUpdate('specialty', newSpecialties[0]?.name || '');
  };

  const currentSpecialtyList = formData.expertType === 'doctor' 
    ? MEDICAL_SPECIALTIES 
    : formData.expertType === 'herbal_practitioner' 
      ? TRADITIONAL_SPECIALTIES 
      : ALL_SPECIALTIES;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 min-h-[700px]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Professional Identity</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Step 2: Confirm your personal details and professional focus.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {formData.expertType.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Personal Details Section (New Step 2 Requirement) */}
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 px-1">
          <User size={14} /> Personal Information
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            id="firstName"
            label="First Name"
            required
            value={userProfile?.firstName || ''}
            disabled={true}
            placeholder="First Name"
            prefixIcon={<User className="w-4 h-4 text-slate-400" />}
            className="!rounded-2xl bg-slate-50"
          />
          <BaseInput
            id="lastName"
            label="Last Name"
            required
            value={userProfile?.lastName || ''}
            disabled={true}
            placeholder="Last Name"
            prefixIcon={<User className="w-4 h-4 text-slate-400" />}
            className="!rounded-2xl bg-slate-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomDatePicker
            label="Date of Birth"
            required
            value={formData.kyc?.dob || ''}
            onChange={(val) => handleUpdate('kyc', { ...formData.kyc, dob: val })}
            error={validationErrors.dob}
          />
          <BaseInput
            id="address"
            label="Residential Address"
            required
            value={formData.kyc?.address || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdate('kyc', { ...formData.kyc, address: e.target.value })}
            placeholder="Full residential address"
            prefixIcon={<MapPin className="w-4 h-4 text-slate-400" />}
            error={validationErrors.address}
            className="!rounded-2xl"
          />
        </div>
      </div>

      {/* Specialties Section */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
            <Award size={14} /> Specialized Areas <span className="text-red-500">*</span>
          </label>
          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full w-fit">
            {specialties.length} Total Fields
          </span>
        </div>

        <div className="pt-2">
          <CustomSelect
            options={[
              ...currentSpecialtyList
                .filter(s => !specialties.some((selected: any) => selected.name === s) && s !== "Other")
                .map(s => ({ value: s, label: s })),
              { value: "Other", label: "Other (Specify...)" }
            ]}
            value={pendingSpecialty || ""}
            onChange={(val) => setPendingSpecialty(val)}
            placeholder="Search through 200+ specialized fields..."
            className="!py-4 !rounded-[24px] shadow-sm border-slate-100 dark:border-slate-800"
          />
        </div>

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
      </div>

      {/* Phone Management */}
      <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
        <ExpertPhoneManager 
          phones={formData.phones} 
          onChange={(p) => handleUpdate('phones', p)}
          primaryPhoneDisabled={true}
        />
        {validationErrors.phones && <p className="text-[10px] text-red-500 font-black uppercase mt-4 tracking-widest">{validationErrors.phones}</p>}
      </div>
      
      <div className="p-6 bg-blue-600 dark:bg-blue-500/5 dark:bg-blue-400/5 rounded-[32px] border border-blue-600/10 dark:border-blue-400/10 flex items-start gap-4 shadow-sm">
        <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-500/20">
          <ShieldCheck size={18} />
        </div>
        <p className="text-[11px] font-bold text-blue-800 dark:text-blue-300 leading-relaxed italic">
          The health network values verified expertise. All personal and professional data is securely processed to maintain community trust and high care standards.
        </p>
      </div>
    </div>
  );
};
