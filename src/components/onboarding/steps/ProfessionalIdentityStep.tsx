'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Shield, GraduationCap, Calendar, User, Phone } from 'lucide-react';
import { FormFieldWrapper } from '../FormFieldWrapper';
import CustomSelect from '../../common/CustomSelect';
import DigitalDatePicker from '../../common/DigitalDatePicker';
import { formatPhoneNumber, calculateAgeRange } from '@/utils/formatters';
import { countries as countryData } from '@/data/countries';

interface ProfessionalIdentityStepProps {
  formData: any;
  setFormData: (data: any) => void;
  validationStatus: any;
}

export default function ProfessionalIdentityStep({ formData, setFormData, validationStatus }: ProfessionalIdentityStepProps) {
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleDateChange = (val: string) => {
    setFormData((prev: any) => {
      const range = calculateAgeRange(val);
      return { 
        ...prev, 
        dateOfBirth: val,
        ...(range ? { ageRange: range } : {})
      };
    });
  };

  const inputClass = "w-full px-6 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-white/5 outline-none transition-all font-black text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 shadow-sm";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      <div className="space-y-2">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Expert Identity.</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Verify your professional credentials to join the elite health network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormFieldWrapper label="First Name" icon={<User size={14} />} isRequired>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Legal First Name"
            className={inputClass}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="Last Name" icon={<User size={14} />} isRequired>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Legal Last Name"
            className={inputClass}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="License Number" icon={<Shield size={14} />} isRequired>
          <input
            type="text"
            value={formData.licenseNumber}
            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
            placeholder="Official Medical License"
            className={inputClass}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="Issuing Board" icon={<Stethoscope size={14} />} isRequired>
          <input
            type="text"
            value={formData.issuingBoard}
            onChange={(e) => handleInputChange('issuingBoard', e.target.value)}
            placeholder="e.g. Medical Council of Canada"
            className={inputClass}
          />
        </FormFieldWrapper>

        {formData.role === 'wellness_practitioner' && (
          <FormFieldWrapper label="Practice Name" icon={<Shield size={14} />}>
            <input
              type="text"
              value={formData.practiceName}
              onChange={(e) => handleInputChange('practiceName', e.target.value)}
              placeholder="e.g. Zen Wellness Studio"
              className={inputClass}
            />
          </FormFieldWrapper>
        )}

        <FormFieldWrapper label="Graduation Year" icon={<Calendar size={14} />} isRequired>
          <input
            type="text"
            value={formData.graduationYear}
            onChange={(e) => handleInputChange('graduationYear', e.target.value)}
            placeholder="Year of Professional Qualification"
            className={inputClass}
          />
        </FormFieldWrapper>

        {formData.role === 'wellness_practitioner' && (
          <FormFieldWrapper label="Years of Experience" icon={<Stethoscope size={14} />} isRequired>
            <input
              type="text"
              value={formData.yearsOfExperience}
              onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
              placeholder="e.g. 10"
              className={inputClass}
            />
          </FormFieldWrapper>
        )}

        {formData.role === 'doctor' && (
          <FormFieldWrapper label="NPI Number (Optional)" icon={<Shield size={14} />}>
            <input
              type="text"
              value={formData.npiNumber}
              onChange={(e) => handleInputChange('npiNumber', e.target.value)}
              placeholder="National Provider Identifier"
              className={inputClass}
            />
          </FormFieldWrapper>
        )}

        <FormFieldWrapper label="Username" icon={<GraduationCap size={14} />} isRequired>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
            placeholder="Professional Handle"
            className={inputClass}
          />
        </FormFieldWrapper>

        <div className="md:col-span-2">
          <FormFieldWrapper label="Phone Number" icon={<Phone size={14} />} isRequired>
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

        <div className="md:col-span-2">
          <FormFieldWrapper label="Date of Birth" icon={<Calendar size={14} />} isRequired>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-[3]">
                <DigitalDatePicker 
                  value={formData.dateOfBirth || ''}
                  onChange={handleDateChange}
                />
              </div>
              <div className="flex-[2]">
                <CustomSelect
                  value={formData.ageRange}
                  onChange={(val) => setFormData({ ...formData, ageRange: val })}
                  options={['18-24', '25-34', '35-44', '45-54', '55+'].map(a => ({ value: a, label: a }))}
                  placeholder="Age Range"
                />
              </div>
            </div>
          </FormFieldWrapper>
        </div>
      </div>
    </motion.div>
  );
}
