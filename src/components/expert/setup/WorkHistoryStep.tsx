'use client';

import React from 'react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import { ExperienceDatePicker } from '@/components/expert/ExperienceDatePicker';

interface WorkHistoryStepProps {
  formData: any;
  updateArrayItem: (field: 'education' | 'experience', index: number, key: string, value: string) => void;
  addItem: (field: 'education' | 'experience') => void;
  removeItem: (field: 'education' | 'experience', index: number) => void;
  validationErrors: Record<string, string>;
}

export const WorkHistoryStep: React.FC<WorkHistoryStepProps> = ({
  formData,
  updateArrayItem,
  addItem,
  removeItem,
  validationErrors
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
        <Briefcase className="w-5 h-5 text-blue-600" /> 
        Work History
      </h3>
      {formData.experience.map((exp: any, i: number) => (
        <div key={i} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 relative group">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <BaseInput id={`role-${i}`} label="Position / Role" value={exp.role} onChange={(e) => updateArrayItem('experience', i, 'role', e.target.value)} placeholder="Senior Consultant Surgeon" />
            <BaseInput id={`comp-${i}`} label="Organization / Practice" value={exp.company} onChange={(e) => updateArrayItem('experience', i, 'company', e.target.value)} placeholder="General Hospital" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExperienceDatePicker 
              label="Start Date" 
              value={exp.startDate} 
              onChange={(val) => updateArrayItem('experience', i, 'startDate', val)} 
            />
            <ExperienceDatePicker 
              label="End Date" 
              value={exp.endDate} 
              onChange={(val) => updateArrayItem('experience', i, 'endDate', val)} 
              allowPresent
            />
          </div>
          {validationErrors[`exp-${i}`] && <p className="mt-4 text-xs text-red-500">{validationErrors[`exp-${i}`]}</p>}
          
          {formData.experience.length > 1 && (
            <button onClick={() => removeItem('experience', i)} className="absolute -top-3 -right-3 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button onClick={() => addItem('experience')} className="text-sm font-bold text-blue-600 flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 transition-colors">
        <Plus className="w-4 h-4" /> Add Work Experience
      </button>
    </div>
  );
};
