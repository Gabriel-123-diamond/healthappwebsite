'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Building } from 'lucide-react';
import CustomSelect from '@/components/common/CustomSelect';
import { BaseInput } from '@/components/common/BaseInput';
import { useLanguage } from '@/context/LanguageContext';

import { FormFieldWrapper } from '../FormFieldWrapper';

interface LocationStepProps {
  formData: any;
  setFormData: (data: any) => void;
  countries: any[];
  allStates?: any[];
}

export default function LocationStep({ formData, setFormData, countries, allStates = [] }: LocationStepProps) {
  const { t } = useLanguage();

  const countryOptions = countries.map(c => ({
    value: c.iso2,
    label: `${c.emoji} ${c.name}`
  }));

  const stateOptions = allStates.map(s => ({
    value: s.iso2,
    label: s.name
  }));

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 sm:space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
          Step 4: Location
        </div>
        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Your Base of Operations</h3>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
          Help us connect you with local health networks and community members.
        </p>
      </div>

      <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-[32px] sm:rounded-[40px] border border-slate-100 dark:border-slate-700 p-6 sm:p-10 pb-32 sm:pb-40 shadow-sm space-y-10 transition-colors duration-500 min-h-[700px]">
        {/* Manual Inputs */}
        <div className="space-y-8">
          <FormFieldWrapper label="Country" icon={<Globe size={14} />} isRequired>
            <CustomSelect
              options={countryOptions}
              value={formData.countryIso}
              onChange={(val) => {
                const c = countries.find(c => c.iso2 === val);
                setFormData({
                  ...formData, 
                  country: c?.name || '', 
                  countryIso: val,
                  state: '',
                  stateIso: '',
                  city: ''
                });
              }}
              placeholder="Select Country"
              className="!rounded-[20px]"
            />
          </FormFieldWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <FormFieldWrapper label="State / Province" icon={<MapPin size={14} />} isRequired>
              <CustomSelect
                options={stateOptions}
                value={formData.stateIso}
                disabled={!formData.countryIso}
                onChange={(val) => {
                  const s = allStates.find(s => s.iso2 === val);
                  setFormData({
                    ...formData, 
                    state: s?.name || '', 
                    stateIso: val,
                    city: ''
                  });
                }}
                placeholder={formData.countryIso ? "Select State" : "Select Country first"}
                className="!rounded-[20px]"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="City" icon={<Building size={14} />} isRequired>
              <BaseInput
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Enter your city"
                disabled={!formData.stateIso}
                className="!rounded-[20px]"
              />
            </FormFieldWrapper>
          </div>

          {formData.role === 'doctor' && (
            <>
              <FormFieldWrapper label="Primary Practice Address" icon={<MapPin size={14} />} isRequired>
                <BaseInput
                  id="practice-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Suite, Unit"
                  className="!rounded-[20px]"
                />
              </FormFieldWrapper>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Telehealth Preference</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Are you available for virtual consultations?</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, telehealthPreference: !formData.telehealthPreference })}
                  className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${formData.telehealthPreference ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${formData.telehealthPreference ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </>
          )}

          {formData.role === 'wellness_practitioner' && (
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Mobile Service</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Will you travel to the patient's location?</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, willTravel: !formData.willTravel })}
                className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${formData.willTravel ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${formData.willTravel ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          )}

          <FormFieldWrapper label="Timezone Preference" icon={<Globe size={14} />} isRequired>
            <CustomSelect
              options={[
                { value: 'UTC', label: 'UTC (Greenwich Mean Time)' },
                { value: 'GMT', label: 'GMT (Western European Time)' },
                { value: 'WAT', label: 'WAT (West Africa Time)' },
                { value: 'CAT', label: 'CAT (Central Africa Time)' },
                { value: 'EAT', label: 'EAT (East Africa Time)' },
                { value: 'EST', label: 'EST (Eastern Standard Time)' },
                { value: 'CST', label: 'CST (Central Standard Time)' },
                { value: 'MST', label: 'MST (Mountain Standard Time)' },
                { value: 'PST', label: 'PST (Pacific Standard Time)' },
              ]}
              value={formData.timezone}
              onChange={(val) => setFormData({ ...formData, timezone: val })}
              placeholder="Select Timezone"
              className="!rounded-[20px]"
            />
          </FormFieldWrapper>
        </div>
      </div>
    </motion.div>
  );
}
