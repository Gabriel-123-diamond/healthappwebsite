'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, DollarSign, Calendar, Languages } from 'lucide-react';
import { BaseTextArea } from '@/components/common/BaseTextArea';
import { BaseInput } from '@/components/common/BaseInput';
import { LanguageSelector } from '@/components/expert/LanguageSelector';
import { AvailabilityScheduler } from '@/components/expert/AvailabilityScheduler';

interface ProfessionalProfileStepProps {
  formData: any;
  handleUpdate: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export default function ProfessionalProfileStep({ formData, handleUpdate, validationErrors }: ProfessionalProfileStepProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Professional Profile</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Build your public profile to attract patients and clients.</p>
      </div>

      <BaseTextArea
        id="bio"
        label="Professional Bio (Max 500 words)"
        required
        value={formData.bio}
        onChange={(e) => handleUpdate('bio', e.target.value)}
        rows={6}
        placeholder="Tell us about your background, expertise, and philosophy of care..."
        error={validationErrors.bio}
        helperText={`${formData.bio.split(/\s+/).filter(Boolean).length}/500 words`}
      />

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Areas of Expertise</label>
        <BaseInput 
          id="expertise" 
          value={formData.profile?.expertise?.join(', ') || ''} 
          onChange={(e) => {
            const list = e.target.value.split(',').map(item => item.trim());
            handleUpdate('profile', { ...formData.profile, expertise: list });
          }} 
          placeholder="e.g. Hypertension, Diabetes, Pediatric Care (comma separated)" 
          prefixIcon={<Award className="w-4 h-4 text-slate-400" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <BaseInput 
          id="fee" 
          label="Consultation Fee (USD)" 
          type="number" 
          containerClassName="md:max-w-xs"
          value={formData.profile?.consultationFee || ''} 
          onChange={(e) => handleUpdate('profile', { ...formData.profile, consultationFee: e.target.value })} 
          placeholder="e.g. 50" 
          prefixIcon={<DollarSign className="w-4 h-4 text-slate-400" />}
        />
        
        <AvailabilityScheduler 
          value={formData.profile?.availability || ''} 
          onChange={(val) => handleUpdate('profile', { ...formData.profile, availability: val })}
        />
      </div>

      <LanguageSelector 
        selectedLanguages={formData.languages}
        onChange={(l) => handleUpdate('languages', l)}
      />
    </motion.div>
  );
}
