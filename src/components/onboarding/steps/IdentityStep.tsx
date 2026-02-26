'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtSign, Loader2, Check, X, User, Phone, Calendar as CalendarIcon, Info } from 'lucide-react';
import CustomSelect from '../../common/CustomSelect';
import { FormFieldWrapper } from '../FormFieldWrapper';
import { countries as countryData } from '@/data/countries';

interface IdentityStepProps {
  formData: any;
  setFormData: (data: any) => void;
  validationStatus: any;
  countries: any[];
  t: (key: string) => string;
}

export default function IdentityStep({ formData, setFormData, validationStatus, countries, t }: IdentityStepProps) {
  const [exclaim, setExclaim] = useState<string | null>(null);

  const selectedCountry = countryData.find(c => c.code === formData.countryCode) || countryData.find(c => c.code === '+234');
  const minLen = selectedCountry?.min || 7;
  const maxLen = selectedCountry?.max || 15;

  const handleNameInput = (field: 'firstName' | 'lastName', val: string) => {
    const filtered = val.replace(/[^a-zA-Z-]/g, '');
    if (val !== filtered) {
      setExclaim(field);
      setTimeout(() => setExclaim(null), 1000);
    }
    setFormData({ ...formData, [field]: filtered });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 sm:space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
          Step 2: Basic Identity
        </div>
        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Tell us about yourself</h3>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
          These details help us personalize your experience and verify your professional status.
        </p>
      </div>

      <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-[32px] sm:rounded-[40px] border border-slate-100 dark:border-slate-700 p-6 sm:p-10 shadow-sm space-y-8 transition-colors duration-500">
        <FormFieldWrapper label="Full Name" icon={<User size={14} />} isRequired>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative group">
              <input 
                type="text" 
                value={formData.firstName} 
                onChange={(e) => handleNameInput('firstName', e.target.value)} 
                className={`w-full px-5 sm:px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 outline-none transition-all font-bold text-slate-900 dark:text-white text-sm sm:text-base ${
                  exclaim === 'firstName' ? 'border-red-500 ring-4 ring-red-100 dark:ring-red-900/20' :
                  'border-transparent focus:border-blue-500'
                }`}
                placeholder="First Name (e.g. John)" 
              />
              <AnimatePresence>
                {exclaim === 'firstName' && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute -top-8 left-0 text-[10px] font-black text-red-500 uppercase bg-white dark:bg-slate-900 px-2 py-1 rounded shadow-sm border border-red-100 dark:border-red-900/50">Letters & Hyphens only!</motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative group">
              <input 
                type="text" 
                value={formData.lastName} 
                onChange={(e) => handleNameInput('lastName', e.target.value)} 
                className={`w-full px-5 sm:px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 outline-none transition-all font-bold text-slate-900 dark:text-white text-sm sm:text-base ${
                  exclaim === 'lastName' ? 'border-red-500 ring-4 ring-red-100 dark:ring-red-900/20' :
                  'border-transparent focus:border-blue-500'
                }`}
                placeholder="Last Name (e.g. Doe)" 
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {validationStatus.name === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                {validationStatus.name === 'available' && <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"><Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" strokeWidth={4} /></div>}
                {(validationStatus.name === 'taken' || validationStatus.name === 'invalid') && <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-full"><X className="w-2.5 h-2.5 text-red-600 dark:text-red-400" strokeWidth={4} /></div>}
              </div>
            </div>
          </div>
        </FormFieldWrapper>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8">
          <FormFieldWrapper label="Username" icon={<AtSign size={14} />} isRequired className="sm:col-span-5">
            <div className="relative group">
              <input 
                type="text" 
                value={formData.username}
                maxLength={15}
                onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '').slice(0, 15)})}
                className={`w-full px-5 sm:px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 outline-none transition-all font-bold text-slate-900 dark:text-white text-sm sm:text-base ${
                  validationStatus.username === 'taken' ? 'border-red-500' : 'border-transparent focus:border-blue-500'
                }`}
                placeholder="johndoe"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {validationStatus.username === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                {validationStatus.username === 'available' && <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"><Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" strokeWidth={4} /></div>}
                {validationStatus.username === 'taken' && <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-full"><X className="w-2.5 h-2.5 text-red-600 dark:text-red-400" strokeWidth={4} /></div>}
              </div>
            </div>
          </FormFieldWrapper>

          <FormFieldWrapper label="DOB / Age Range" icon={<CalendarIcon size={14} />} isRequired className="sm:col-span-7">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="date" 
                value={formData.dateOfBirth || ''}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="flex-[2] min-w-0 px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-transparent outline-none focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-sm"
              />
              <div className="flex-1 min-w-[120px]">
                <CustomSelect
                  value={formData.ageRange}
                  onChange={(val) => setFormData({ ...formData, ageRange: val })}
                  options={['18-24', '25-34', '35-44', '45-54', '55+'].map(a => ({ value: a, label: a }))}
                  placeholder="Age Range"
                  className="!rounded-2xl !py-4"
                />
              </div>
            </div>
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper label="Phone Number" icon={<Phone size={14} />} isRequired>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-40 shrink-0">
              <CustomSelect
                value={`${formData.countryCode}:${countryData.find(c => c.code === formData.countryCode)?.name}`}
                onChange={(val) => {
                  const [code] = val.split(':');
                  setFormData({ ...formData, countryCode: code });
                }}
                options={countryData.map(c => ({ 
                  value: `${c.code}:${c.name}`, 
                  key: `${c.code}-${c.name}`,
                  label: `${c.flag} ${c.code} (${c.name.charAt(0).toUpperCase() + c.name.slice(1)})` 
                }))}
                placeholder="+1"
                className="!rounded-2xl !py-4"
              />
            </div>
            <input 
              type="tel" 
              value={formData.phone} 
              suppressHydrationWarning
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d+]/g, '').slice(0, maxLen);
                const formatted = raw.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
                setFormData({...formData, phone: formatted});
              }}
              className="flex-1 min-w-0 px-5 sm:px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-transparent outline-none focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-sm sm:text-lg tracking-wider"
              placeholder="801 234 5678" 
            />
          </div>
        </FormFieldWrapper>

        <div className="flex items-start gap-4 bg-blue-50 dark:bg-blue-900/20 p-5 sm:p-6 rounded-[24px] sm:rounded-3xl border border-blue-100 dark:border-blue-800/50 shadow-sm transition-colors duration-500">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
            <Info size={20} />
          </div>
          <p className="text-[11px] sm:text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
            Ensure your name matches your professional license if you are registering as a health expert. You cannot change your legal name after verification.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
