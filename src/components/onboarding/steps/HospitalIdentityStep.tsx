'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Hash, User, Phone, Briefcase } from 'lucide-react';
import { FormFieldWrapper } from '../FormFieldWrapper';
import { useTranslations } from 'next-intl';
import CustomSelect from '../../common/CustomSelect';
import { countries as countryData } from '@/data/countries';
import { formatPhoneNumber } from '@/utils/formatters';

interface HospitalIdentityStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function HospitalIdentityStep({ formData, setFormData }: HospitalIdentityStepProps) {
  const t = useTranslations('onboarding.hospital');

  const facilityTypes = [
    { value: 'general', label: 'General Hospital' },
    { value: 'specialist', label: 'Specialist Clinic' },
    { value: 'diagnostic', label: 'Diagnostic Center' },
    { value: 'pharmacy', label: 'Pharmacy / Dispensary' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const inputClass = "w-full px-6 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-white/5 outline-none transition-all font-black text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 shadow-sm";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8 pb-32"
    >
      <div className="space-y-2">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Facility Node.</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Register your institution within the global health infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <FormFieldWrapper label="Facility Name" icon={<Building2 size={14} />} isRequired>
          <input
            type="text"
            value={formData.facilityName}
            onChange={(e) => handleInputChange('facilityName', e.target.value)}
            placeholder="e.g. Saint Mary General"
            className={inputClass}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="Facility Type" icon={<Briefcase size={14} />} isRequired>
          <CustomSelect
            value={formData.facilityType}
            onChange={(val) => handleInputChange('facilityType', val)}
            options={facilityTypes}
            placeholder="Select Type"
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="Registration Number" icon={<Hash size={14} />} isRequired>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
            placeholder="Official License ID"
            className={inputClass}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="Bed Capacity" icon={<Building2 size={14} />} isRequired>
          <input
            type="number"
            value={formData.bedCapacity}
            onChange={(e) => handleInputChange('bedCapacity', e.target.value)}
            placeholder="Total Patient Capacity"
            className={inputClass}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="Administrator Name" icon={<User size={14} />} isRequired>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Primary Contact Person"
            className={inputClass}
          />
        </FormFieldWrapper>

        <div className="md:col-span-2 relative z-20">
          <FormFieldWrapper label="Official Phone Number" icon={<Phone size={14} />} isRequired>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3">
                <CustomSelect
                  value={formData.countryCode}
                  onChange={(val) => setFormData({ ...formData, countryCode: val })}
                  options={countryData.map(c => ({ value: c.code, label: `${c.flag} ${c.code}` }))}
                  placeholder="+1"
                />
              </div>
              <div className="flex-1">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={12}
                  placeholder="e.g. 800 000 0000"
                  className={inputClass}
                />
              </div>
            </div>
          </FormFieldWrapper>
        </div>
      </div>
    </motion.div>
  );
}
