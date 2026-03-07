'use client';

import React from 'react';
import { Globe, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';

interface OnlinePresenceStepProps {
  formData: any;
  handleUpdate: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export const OnlinePresenceStep: React.FC<OnlinePresenceStepProps> = ({
  formData,
  handleUpdate,
  validationErrors
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" /> 
          Online Presence
        </h3>
        <p className="text-sm text-slate-500 mt-1">LinkedIn and Website help patients verify your credentials.</p>
      </div>

      <div className="space-y-6">
        <BaseInput 
          id="web" 
          label={`Official Website ${formData.expertType === 'hospital' ? '(Compulsory)' : '(Optional)'}`}
          required={formData.expertType === 'hospital'}
          value={formData.website} 
          onChange={(e) => handleUpdate('website', e.target.value)} 
          placeholder="https://www.example.com" 
          prefixIcon={<LinkIcon className="w-4 h-4 text-slate-400" />} 
          error={validationErrors.website}
        />
        <BaseInput 
          id="li" 
          label="LinkedIn Profile (Optional)" 
          value={formData.linkedin} 
          onChange={(e) => handleUpdate('linkedin', e.target.value)} 
          placeholder="https://linkedin.com/in/yourprofile" 
          prefixIcon={<LinkIcon className="w-4 h-4 text-slate-400" />} 
        />
      </div>

      <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex gap-4">
        <ShieldCheck className="w-10 h-10 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-blue-900 dark:text-blue-400">Final Verification</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300/80 leading-relaxed mt-1">
            Once you submit, our team will review your credentials. You can update these details later from your expert dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};
