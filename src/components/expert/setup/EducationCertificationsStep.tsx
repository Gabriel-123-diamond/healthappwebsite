'use client';

import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, FileText, CheckCircle2, Upload } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import { MonthYearPicker } from '@/components/common/MonthYearPicker';

interface EducationCertificationsStepProps {
  formData: any;
  updateArrayItem: (field: 'education', index: number, key: string, value: string) => void;
  addItem: (field: 'education') => void;
  removeItem: (field: 'education', index: number) => void;
  validationErrors: Record<string, string>;
}

export const EducationCertificationsStep: React.FC<EducationCertificationsStepProps> = ({
  formData,
  updateArrayItem,
  addItem,
  removeItem,
  validationErrors
}) => {
  const [uploading, setUploading] = useState<number | null>(null);

  const mockUpload = (index: number) => {
    setUploading(index);
    setTimeout(() => {
      updateArrayItem('education', index, 'certUrl', `mock-cert-url-${index}`);
      setUploading(null);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
        <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" /> 
        Education & Certifications
      </h3>
      <p className="text-sm text-slate-500 mb-4">Add your degrees and professional certifications to build trust with patients.</p>
      
      {formData.education.map((edu: any, i: number) => (
        <div key={i} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-200 dark:border-slate-800 relative group space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BaseInput id={`deg-${i}`} label="Degree / Cert" value={edu.degree} onChange={(e) => updateArrayItem('education', i, 'degree', e.target.value)} placeholder="MBBS, BHMS, etc." />
            <BaseInput id={`inst-${i}`} label="Institution" value={edu.institution} onChange={(e) => updateArrayItem('education', i, 'institution', e.target.value)} placeholder="Medical School / Institute" />
            <MonthYearPicker 
              label="Year Completed" 
              value={edu.year} 
              onChange={(val) => updateArrayItem('education', i, 'year', val)} 
              placeholder="Select Date" 
            />
          </div>

          <div 
            onClick={() => mockUpload(i)}
            className={`p-4 rounded-2xl border-2 border-dashed flex items-center justify-between cursor-pointer transition-all ${
              edu.certUrl 
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' 
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${edu.certUrl ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                {edu.certUrl ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-slate-400" />}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Certificate / Diploma</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {edu.certUrl ? 'Document Uploaded' : 'Click to upload proof'}
                </p>
              </div>
            </div>
            {uploading === i ? (
               <div className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : !edu.certUrl && <Upload className="w-4 h-4 text-slate-300" />}
          </div>

          {validationErrors[`edu-${i}`] && <p className="text-xs text-red-500 font-bold">{validationErrors[`edu-${i}`]}</p>}
          
          {formData.education.length > 1 && (
            <button onClick={() => removeItem('education', i)} className="absolute -top-3 -right-3 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button onClick={() => addItem('education')} className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
        <Plus className="w-4 h-4" /> Add Another Qualification
      </button>
    </div>
  );
};
