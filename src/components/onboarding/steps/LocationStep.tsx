'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import CustomSelect from '@/components/common/CustomSelect';
import { countries } from '@/data/countries';
import { useLanguage } from '@/context/LanguageContext';

interface LocationStepProps {
  formData: any;
  setFormData: (data: any) => void;
  locationData: any;
  requestLocation: () => void;
}

export default function LocationStep({ formData, setFormData, locationData, requestLocation }: LocationStepProps) {
  const { t } = useLanguage();

  const countryOptions = countries.map(c => {
    const countryName = (t.countries as any)?.[c.name] || c.name;
    return {
      value: countryName,
      label: `${c.flag} ${countryName}`
    };
  });

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50/50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-blue-100/50 gap-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 sm:mb-2">Your Location</h3>
          <p className="text-slate-500 font-medium text-xs sm:text-sm">Click the pin to auto-fill your location.</p>
        </div>
        <button 
          onClick={requestLocation} 
          className={`w-full sm:w-auto p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all border group flex items-center justify-center gap-3 ${
            locationData 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
          }`}
        >
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
            {locationData ? 'Location Found' : 'Auto-Detect'}
          </span>
          <MapPin className={`w-5 h-5 sm:w-6 sm:h-6 ${locationData ? 'fill-emerald-600' : 'group-hover:scale-110'}`} />
        </button>
      </div>
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
            City <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            value={formData.city} 
            onChange={(e) => setFormData({...formData, city: e.target.value})} 
            className="w-full px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-white border border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/5 outline-none transition-all font-bold text-slate-900 shadow-sm text-sm sm:text-base" 
            placeholder="e.g. San Francisco" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
            Country <span className="text-red-500">*</span>
          </label>
          <CustomSelect
            options={countryOptions}
            value={formData.country}
            onChange={(val) => setFormData({...formData, country: val})}
            placeholder="Select Country"
          />
        </div>
      </div>
    </motion.div>
  );
}