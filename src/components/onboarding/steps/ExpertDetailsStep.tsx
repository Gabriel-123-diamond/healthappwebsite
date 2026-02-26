import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, FileText, Building2, ShieldCheck, Award } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import CustomSelect from '@/components/common/CustomSelect';
import { ALL_SPECIALTIES } from '@/data/specialties';

interface ExpertDetailsStepProps {
  formData: any;
  setFormData: (data: any) => void;
  stepNumber?: number;
}

export default function ExpertDetailsStep({ formData, setFormData, stepNumber = 4 }: ExpertDetailsStepProps) {
  const isHospital = formData.role === 'hospital';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="space-y-10 min-h-[700px]"
    >
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
          Step {stepNumber}: Expert Credentials
        </div>
        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Professional Proof</h3>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
          Please provide your verified credentials to establish trust within the community.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 sm:p-10 shadow-sm space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em] flex items-center gap-2">
              <Award className="w-3 h-3" />
              Primary Specialty <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              options={ALL_SPECIALTIES.map(s => ({ value: s, label: s }))}
              value={formData.specialty}
              onChange={(val) => setFormData({...formData, specialty: val})}
              placeholder="Search specialties..."
              className="py-4 !rounded-2xl !border-slate-100 dark:!border-slate-800"
            />
          </div>

          {formData.specialty === 'Other' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <BaseInput
                id="customSpecialty"
                label="Specify Your Specialty"
                required
                value={formData.customSpecialty || ''}
                onChange={(e) => setFormData({...formData, customSpecialty: e.target.value})}
                placeholder="e.g. Traditional Bone Setter"
                className="py-4 !rounded-2xl !border-slate-100 dark:!border-slate-800"
              />
            </motion.div>
          )}

          <div className="pt-2 space-y-6">
            {isHospital && (
              <BaseInput
                id="institutionName"
                label="Institution Name"
                required
                value={formData.institutionName}
                onChange={(e) => setFormData({...formData, institutionName: e.target.value})}
                placeholder="Official Hospital/Clinic Name"
                prefixIcon={<Building2 className="w-5 h-5 text-slate-400" />}
                className="py-4 !rounded-2xl !border-slate-100 dark:!border-slate-800"
              />
            )}
            
            <BaseInput
              id="licenseNumber"
              label={isHospital ? "Registration / License ID" : "Professional License Number"}
              required
              value={formData.licenseNumber}
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              placeholder={isHospital ? "Hospital Registration Number" : "Medical License ID"}
              prefixIcon={<FileText className="w-5 h-5 text-slate-400" />}
              className="py-4 !rounded-2xl !border-slate-100 dark:!border-slate-800"
            />
          </div>
        </div>

        <div className="flex items-start gap-4 bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-900 dark:text-white font-black uppercase tracking-widest">Verification Protocol</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              To maintain platform integrity, you will be required to upload supporting documents once your basic profile is established.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
