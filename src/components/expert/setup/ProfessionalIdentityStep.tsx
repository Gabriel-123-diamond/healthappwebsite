'use client';

import React, { useState } from 'react';
import { User, ShieldCheck, Award, Plus } from 'lucide-react';
import CustomSelect from '@/components/common/CustomSelect';
import { ALL_SPECIALTIES, MEDICAL_SPECIALTIES, TRADITIONAL_SPECIALTIES } from '@/data/specialties';
import { PersonalInfoFields } from './identity/PersonalInfoFields';
import { SpecialtyAssignment } from './identity/SpecialtyAssignment';
import { SpecialtyList } from './identity/SpecialtyList';

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

      <PersonalInfoFields 
        userProfile={userProfile}
        formData={formData}
        handleUpdate={handleUpdate}
        validationErrors={validationErrors}
      />

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

        <SpecialtyAssignment 
          pendingSpecialty={pendingSpecialty}
          setPendingSpecialty={setPendingSpecialty}
          pendingYears={pendingYears}
          setPendingYears={setPendingYears}
          customName={customName}
          setCustomName={setCustomName}
          handleAssign={handleAssign}
        />
        
        <SpecialtyList 
          specialties={specialties}
          handleUpdate={handleUpdate}
          validationErrors={validationErrors}
          removeSpecialty={removeSpecialty}
          pendingSpecialty={pendingSpecialty}
        />
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
