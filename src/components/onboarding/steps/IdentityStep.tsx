'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AtSign, Loader2, Check, X } from 'lucide-react';
import CustomSelect from '../../common/CustomSelect';

interface IdentityStepProps {
  formData: any;
  setFormData: (data: any) => void;
  validationStatus: any;
  countries: any[];
  t: (key: string) => string;
}

export default function IdentityStep({ formData, setFormData, validationStatus, countries, t }: IdentityStepProps) {
  const [exclaim, setExclaim] = useState<string | null>(null);

  const handleNameInput = (field: 'firstName' | 'lastName', val: string) => {
    const filtered = val.replace(/[^a-zA-Z-]/g, '');
    if (val !== filtered) {
      setExclaim(field);
      setTimeout(() => setExclaim(null), 1000);
    }
    setFormData({ ...formData, [field]: filtered });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h3 className="text-3xl font-black text-slate-900 mb-2">Basic Information</h3>
        <p className="text-slate-500 font-medium text-sm">Tell us who you are. This information will help others identify you.</p>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">Only letters and "-" allowed.</p>
          {exclaim && (
            <motion.span 
              initial={{ scale: 0 }} 
              animate={{ scale: 1.2, x: [0, -5, 5, -5, 5, 0] }} 
              className="text-[10px] text-red-600 font-black uppercase bg-red-50 px-2 py-1 rounded-md border border-red-100"
            >
              Hey! Only letters & hyphens!
            </motion.span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={formData.firstName} 
              onChange={(e) => handleNameInput('firstName', e.target.value)} 
              className={`w-full px-5 py-4 rounded-2xl bg-white border outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:font-normal placeholder:text-slate-400 ${
                exclaim === 'firstName' ? 'border-red-500 ring-4 ring-red-100' :
                validationStatus.name === 'invalid' || validationStatus.name === 'taken' ? 'border-red-500 focus:ring-red-200' : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/5'
              }`}
              placeholder="John" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={formData.lastName} 
              onChange={(e) => handleNameInput('lastName', e.target.value)} 
              className={`w-full px-5 py-4 rounded-2xl bg-white border outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:font-normal placeholder:text-slate-400 ${
                exclaim === 'lastName' ? 'border-red-500 ring-4 ring-red-100' :
                validationStatus.name === 'invalid' || validationStatus.name === 'taken' ? 'border-red-500 focus:ring-red-200' : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/5'
              }`}
              placeholder="Doe" 
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {validationStatus.name === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
              {(validationStatus.name === 'taken' || validationStatus.name === 'invalid') && <div className="p-1 bg-red-100 rounded-full"><X className="w-3 h-3 text-red-600" /></div>}
              {validationStatus.name === 'available' && <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-3 h-3 text-emerald-600" /></div>}
            </div>
          </div>
        </div>
      </div>
      {validationStatus.name === 'invalid' && <p className="text-xs text-red-500 font-bold ml-1">Names must contain only letters and hyphens.</p>}
      {validationStatus.name === 'taken' && <p className="text-xs text-red-500 font-bold ml-1">Name combination is unavailable.</p>}

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
          Username <span className="text-red-500">*</span>
        </label>
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-50 group-focus-within:bg-blue-50 transition-colors">
            <AtSign className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
          </div>
          <input 
            type="text" 
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
            className={`w-full pl-16 pr-12 py-4 rounded-2xl bg-white border outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:font-normal placeholder:text-slate-400 ${
              validationStatus.username === 'taken' ? 'border-red-500 focus:ring-red-200' : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/5'
            }`}
            placeholder="johndoe"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            {validationStatus.username === 'checking' && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
            {validationStatus.username === 'available' && <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-3 h-3 text-emerald-600" /></div>}
            {validationStatus.username === 'taken' && <div className="p-1 bg-red-100 rounded-full"><X className="w-3 h-3 text-red-600" /></div>}
          </div>
        </div>
        {validationStatus.username === 'taken' && <p className="text-xs text-red-500 font-bold ml-1">Username is already taken.</p>}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3 relative z-20">
          <div className="w-36">
            <CustomSelect
              value={formData.countryCode}
              onChange={(val) => setFormData({ ...formData, countryCode: val })}
              options={countries.map(c => ({ 
                value: c.code, 
                label: `${t(`countries.${c.name}`)} (${c.code})` 
              }))}
              placeholder="+1"
            />
          </div>
          <div className="relative flex-1">
            <input 
              type="tel" 
              value={formData.phone} 
              onChange={(e) => {
                const selectedCountry = countries.find(c => c.code === formData.countryCode);
                const limit = selectedCountry?.max || 15;
                const val = e.target.value.replace(/\D/g, '').slice(0, limit);
                setFormData({...formData, phone: val});
              }}
              className={`w-full px-5 py-4 rounded-2xl bg-white border outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:font-normal placeholder:text-slate-400 ${
                validationStatus.phone === 'taken' ? 'border-red-500 focus:ring-red-200' : 
                (formData.phone && formData.phone.length < (countries.find(c => c.code === formData.countryCode)?.min || 0)) ? 'border-amber-400 focus:ring-amber-100' :
                'border-slate-100 focus:border-blue-500 focus:ring-blue-500/5'
              }`} 
              placeholder="801 234 5678" 
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {formData.phone && formData.phone.length < (countries.find(c => c.code === formData.countryCode)?.min || 0) && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">NOT VALID YET</span>
              )}
              {validationStatus.phone === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
              {validationStatus.phone === 'taken' && <div className="p-1 bg-red-100 rounded-full"><X className="w-3 h-3 text-red-600" /></div>}
              {validationStatus.phone === 'available' && formData.phone.length >= (countries.find(c => c.code === formData.countryCode)?.min || 0) && <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-3 h-3 text-emerald-600" /></div>}
            </div>
          </div>
        </div>
        {validationStatus.phone === 'taken' && <p className="text-xs text-red-500 font-bold ml-1">Phone number is already associated with an account.</p>}
      </div>

      <div className="space-y-2 relative z-10">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
          Age Range <span className="text-red-500">*</span>
        </label>
        <CustomSelect
          value={formData.ageRange}
          onChange={(val) => setFormData({ ...formData, ageRange: val })}
          options={['18-24', '25-34', '35-44', '45-54', '55+'].map(a => ({ value: a, label: a }))}
          placeholder="Select Age Range"
        />
      </div>
    </motion.div>
  );
}
