'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtSign, Loader2, Check, X, User, Phone, Calendar as CalendarIcon, Info } from 'lucide-react';
import CustomSelect from '../../common/CustomSelect';
import CustomDatePicker from '../../common/CustomDatePicker';
import { FormFieldWrapper } from '../FormFieldWrapper';
import { countries as countryData } from '@/data/countries';
import { useTranslations } from 'next-intl';

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
  validationStatus, 
  countries, 
  states, 
  cities 
}: IdentityStepProps) {
  const t = useTranslations('onboarding.identity');

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Apply spacing: XXX XXX XXXX
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
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
          <User size={12} />
          {t('title')}
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

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8">
        <FormFieldWrapper label={t('firstName')} icon={<User size={14} />} isRequired className="sm:col-span-6">
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Jane"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-sm"
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('lastName')} icon={<User size={14} />} isRequired className="sm:col-span-6">
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Doe"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-sm"
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('username')} icon={<AtSign size={14} />} isRequired className="sm:col-span-5">
          <div className="relative">
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
              placeholder={t('placeholderUsername')}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {validationStatus.username === 'validating' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
              {validationStatus.username === 'available' && <Check className="w-4 h-4 text-emerald-500" />}
              {validationStatus.username === 'taken' && <X className="w-4 h-4 text-red-500" />}
            </div>
          </div>
        </FormFieldWrapper>

        <FormFieldWrapper label={t('dob')} icon={<CalendarIcon size={14} />} isRequired className="sm:col-span-7">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-[2] min-w-0">
                <CustomDatePicker 
                  value={formData.dateOfBirth || ''}
                  onChange={(val) => setFormData({ ...formData, dateOfBirth: val })}
                  placeholder={t('dob')}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <CustomSelect
                  value={formData.ageRange}
                  onChange={(val) => setFormData({ ...formData, ageRange: val })}
                  options={['18-24', '25-34', '35-44', '45-54', '55+'].map(a => ({ value: a, label: a }))}
                  placeholder={t('ageRange')}
                  className="!rounded-2xl !py-4"
                />
              </div>
            </div>
          </FormFieldWrapper>

        <FormFieldWrapper label={t('phone')} icon={<Phone size={14} />} isRequired className="sm:col-span-12">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-1/3">
              <CustomSelect
                value={formData.countryCode}
                onChange={(val) => setFormData({ ...formData, countryCode: val })}
                options={countryData.map(c => ({ value: c.code, label: `${c.flag} ${c.code}` }))}
                placeholder="+1"
                className="!rounded-2xl !py-4"
              />
            </div>
            <div className="relative flex-1">
              <input
                type="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={12}
                placeholder={t('placeholderPhone')}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {validationStatus.phone === 'validating' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                {validationStatus.phone === 'available' && <Check className="w-4 h-4 text-emerald-500" />}
                {validationStatus.phone === 'taken' && <X className="w-4 h-4 text-red-500" />}
              </div>
            </div>
          </div>
        </FormFieldWrapper>

        <div className="sm:col-span-12 p-6 bg-slate-50 dark:bg-white/[0.02] rounded-[32px] border border-slate-100 dark:border-white/5 flex gap-4">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Ensure your name matches your professional license if you are registering as a health expert. You cannot change your legal name after verification.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
