'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AtSign, Loader2, Check, X, User, Phone, Calendar as CalendarIcon } from 'lucide-react';
import CustomSelect from '../../common/CustomSelect';
import DigitalDatePicker from '../../common/DigitalDatePicker';
import { FormFieldWrapper } from '../FormFieldWrapper';
import { countries as countryData } from '@/data/countries';
import { useTranslations } from 'next-intl';
import IdentitySecurityNode from './IdentitySecurityNode';
import NoSpacesScreamModal from './NoSpacesScreamModal';
import IdentityHeaderNode from './IdentityHeaderNode';
import { formatPhoneNumber, calculateAgeRange } from '@/utils/formatters';

interface IdentityStepProps {
  formData: any;
  setFormData: (data: any) => void;
  validationStatus: any;
  countries: any[];
  states: any[];
  cities: any[];
}

export default function IdentityStep({ 
  formData, 
  setFormData, 
  validationStatus 
}: IdentityStepProps) {
  const t = useTranslations('onboarding.identity');
  const [scream, setScream] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const triggerScream = useCallback(() => {
    setScream(true);
    setTimeout(() => setScream(false), 1500);
  }, []);

  const handleTextChange = (field: string, value: string) => {
    if (value.includes(' ')) {
      triggerScream();
      const cleanValue = value.replace(/\s/g, '');
      setFormData({ ...formData, [field]: cleanValue });
      return;
    }

    const cleanValue = field === 'username' 
      ? value.replace(/[^a-zA-Z0-9_@-]/g, '')
      : value.replace(/[^a-zA-Z-]/g, '');

    setFormData({ ...formData, [field]: cleanValue });
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

  const getInputClassName = (field: string, isInvalid: boolean) => `
    w-full px-6 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-800/50 border-2 
    outline-none transition-all font-black text-slate-900 dark:text-white text-sm shadow-sm
    ${focusedField === field ? 'border-blue-500 bg-white dark:bg-slate-900 ring-8 ring-blue-500/5 shadow-xl' : 
      isInvalid ? 'border-red-500' : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'}
  `.trim();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      className="space-y-12"
    >
      <IdentityHeaderNode />
      <NoSpacesScreamModal isVisible={scream} />

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-10">
        <div className="sm:col-span-12 space-y-6">
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-600">
            <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('personalProfile')}</span>
            <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormFieldWrapper label={t('firstName')} icon={<User size={14} />} isRequired>
              <input
                type="text"
                value={formData.firstName}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleTextChange('firstName', e.target.value)}
                placeholder={t('firstNamePlaceholder')}
                className={getInputClassName('firstName', 
                  validationStatus.name === 'invalid' && (formData.firstName.includes(' ') || /[^a-zA-Z-]/.test(formData.firstName))
                )}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label={t('lastName')} icon={<User size={14} />} isRequired>
              <input
                type="text"
                value={formData.lastName}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleTextChange('lastName', e.target.value)}
                placeholder={t('lastNamePlaceholder')}
                className={getInputClassName('lastName', 
                  validationStatus.name === 'invalid' && (formData.lastName.includes(' ') || /[^a-zA-Z-]/.test(formData.lastName))
                )}
              />
            </FormFieldWrapper>
          </div>
        </div>

        <div className="sm:col-span-12 grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-10">
          <div className="sm:col-span-5 space-y-6">
            <FormFieldWrapper label={t('username')} icon={<AtSign size={14} />} isRequired>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => handleTextChange('username', e.target.value.toLowerCase())}
                  placeholder={t('placeholderUsername')}
                  className={getInputClassName('username', 
                    validationStatus.username === 'invalid' || validationStatus.username === 'taken'
                  )}
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {validationStatus.username === 'validating' && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                  {validationStatus.username === 'available' && (
                    <div className="p-1 bg-emerald-500 rounded-full text-white shadow-lg shadow-emerald-500/30">
                      <Check size={12} strokeWidth={4} />
                    </div>
                  )}
                  {(validationStatus.username === 'taken' || validationStatus.username === 'invalid') && (
                    <div className="p-1 bg-red-500 rounded-full text-white shadow-lg shadow-red-500/30">
                      <X size={12} strokeWidth={4} />
                    </div>
                  )}
                </div>
              </div>
            </FormFieldWrapper>
          </div>

          <div className="sm:col-span-7 space-y-6">
            <FormFieldWrapper label={t('dob')} icon={<CalendarIcon size={14} />} isRequired>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-[3] min-w-0">
                  <DigitalDatePicker 
                    value={formData.dateOfBirth || ''}
                    onChange={handleDateChange}
                  />
                </div>
                <div className="flex-[2] min-w-[140px]">
                  <CustomSelect
                    value={formData.ageRange}
                    onChange={(val) => setFormData({ ...formData, ageRange: val })}
                    options={['18-24', '25-34', '35-44', '45-54', '55+'].map(a => ({ value: a, label: a }))}
                    placeholder={t('ageRange')}
                  />
                </div>
              </div>
            </FormFieldWrapper>
          </div>
        </div>

        <div className="sm:col-span-12">
          <FormFieldWrapper label={t('phone')} icon={<Phone size={14} />} isRequired>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/4">
                <CustomSelect
                  value={formData.countryCode}
                  onChange={(val) => setFormData({ ...formData, countryCode: val })}
                  options={countryData.map(c => ({ value: c.code, label: `${c.flag} ${c.code}` }))}
                  placeholder="+1"
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="tel"
                  value={formData.phone}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  onChange={handlePhoneChange}
                  maxLength={12}
                  placeholder={t('placeholderPhone')}
                  className={getInputClassName('phone', false)}
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  {validationStatus.phone === 'validating' && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                </div>
              </div>
            </div>
          </FormFieldWrapper>
        </div>

        <div className="sm:col-span-12 grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-10">
          <div className="sm:col-span-6 space-y-6">
            <FormFieldWrapper label={t('gender')} icon={<User size={14} />}>
              <CustomSelect
                value={formData.gender}
                onChange={(val) => setFormData({ ...formData, gender: val })}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'non-binary', label: 'Non-binary' },
                  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                ]}
                placeholder={t('genderPlaceholder')}
                className="!rounded-[20px]"
              />
            </FormFieldWrapper>
          </div>

          <div className="sm:col-span-6 space-y-6">
            <FormFieldWrapper label={t('pronouns')} icon={<AtSign size={14} />}>
              <input
                type="text"
                value={formData.pronouns}
                onFocus={() => setFocusedField('pronouns')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
                placeholder={t('pronounsPlaceholder')}
                className={getInputClassName('pronouns', false)}
              />
            </FormFieldWrapper>
          </div>
        </div>

        <IdentitySecurityNode />
      </div>
    </motion.div>
  );
}
