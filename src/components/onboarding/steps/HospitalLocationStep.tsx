'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Navigation, Mail, Building } from 'lucide-react';
import { FormFieldWrapper } from '../FormFieldWrapper';
import CustomSelect from '../../common/CustomSelect';
import { BaseInput } from '../../common/BaseInput';

interface HospitalLocationStepProps {
  formData: any;
  setFormData: (data: any) => void;
  countries: any[];
  allStates: any[];
}

export default function HospitalLocationStep({ formData, setFormData, countries, allStates }: HospitalLocationStepProps) {
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const countryOptions = countries.map(c => ({
    value: c.iso2,
    label: `${c.emoji} ${c.name}`
  }));

  const stateOptions = allStates.map(s => ({
    value: s.iso2,
    label: s.name
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      <div className="space-y-2">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Facility Hub.</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Pin your facility on the global emergency routing map.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="md:col-span-2">
          <FormFieldWrapper label="Street Address" icon={<Navigation size={14} />} isRequired>
            <BaseInput
              id="hospital-address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Physical Facility Location"
              className="!rounded-[20px]"
            />
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper label="City / Area" icon={<Building size={14} />} isRequired>
          <BaseInput
            id="hospital-city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Municipality"
            disabled={!formData.stateIso}
            className="!rounded-[20px]"
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="Postal Code" icon={<Mail size={14} />} isRequired>
          <BaseInput
            id="hospital-postal-code"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            placeholder="ZIP / Postal ID"
            minLength={3}
            maxLength={12}
            className="!rounded-[20px]"
          />
        </FormFieldWrapper>

        <div className="md:col-span-2">
          <FormFieldWrapper label="Emergency Entrance Coordinates" icon={<Navigation size={14} />}>
            <BaseInput
              id="emergency-coordinates"
              value={formData.emergencyCoordinates}
              onChange={(e) => handleInputChange('emergencyCoordinates', e.target.value)}
              placeholder="Latitude, Longitude (optional)"
              className="!rounded-[20px]"
            />
          </FormFieldWrapper>
        </div>
      </div>
    </motion.div>
  );
}
