'use client';

import React, { useState, useRef } from 'react';
import { GraduationCap, Plus, Trash2, FileText, CheckCircle2, Upload, Loader2, X } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import CustomSelect from '@/components/common/CustomSelect';
import { MonthYearPicker } from '@/components/common/MonthYearPicker';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DEGREE_OPTIONS = [
  { value: 'MBBS', label: 'MBBS (Bachelor of Medicine, Bachelor of Surgery)' },
  { value: 'MD', label: 'MD (Doctor of Medicine)' },
  { value: 'DO', label: 'DO (Doctor of Osteopathic Medicine)' },
  { value: 'PhD', label: 'PhD (Doctor of Philosophy)' },
  { value: 'MSc', label: 'MSc (Master of Science)' },
  { value: 'BDS', label: 'BDS (Bachelor of Dental Surgery)' },
  { value: 'DVM', label: 'DVM (Doctor of Veterinary Medicine)' },
  { value: 'BPharm', label: 'BPharm (Bachelor of Pharmacy)' },
  { value: 'RN', label: 'RN (Registered Nurse)' },
  { value: 'NP', label: 'NP (Nurse Practitioner)' },
  { value: 'PA', label: 'PA (Physician Assistant)' },
  { value: 'BHMS', label: 'BHMS (Bachelor of Homeopathic Medicine and Surgery)' },
  { value: 'BAMS', label: 'BAMS (Bachelor of Ayurvedic Medicine and Surgery)' },
  { value: 'Other', label: 'Other Certification' },
];

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
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Authentication required to upload documents.");
      return;
    }

    setUploadingIndex(index);
    try {
      const timestamp = Date.now();
      // Phase 14: Client-side storage protection (10MB)
      if (file.size > 10 * 1024 * 1024) throw new Error("File exceeds 10MB limit.");
      const storageRef = ref(storage, `verifications/${user.uid}/edu_${timestamp}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      updateArrayItem('education', index, 'certUrl', url);
      updateArrayItem('education', index, 'certFileName', file.name);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      setUploadingIndex(null);
      if (fileInputRefs.current[index]) {
         fileInputRefs.current[index]!.value = ''; // Reset input
      }
    }
  };

  const removeFile = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    updateArrayItem('education', index, 'certUrl', '');
    updateArrayItem('education', index, 'certFileName', '');
    if (fileInputRefs.current[index]) {
       fileInputRefs.current[index]!.value = ''; 
    }
  };

  const triggerFileSelect = (index: number, certUrl?: string) => {
    if (!certUrl && uploadingIndex !== index) {
      fileInputRefs.current[index]?.click();
    }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="space-y-2 w-full">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
                Degree / Cert
              </label>
              <CustomSelect
                value={edu.degree}
                onChange={(val) => updateArrayItem('education', i, 'degree', val)}
                options={DEGREE_OPTIONS}
                placeholder="MBBS, BHMS, etc."
                className="!rounded-[24px] !bg-white dark:!bg-slate-900 !border-slate-100 dark:!border-white/5"
              />
            </div>
            <BaseInput 
              id={`inst-${i}`} 
              label="Institution" 
              value={edu.institution} 
              onChange={(e) => updateArrayItem('education', i, 'institution', e.target.value)} 
              placeholder="Medical School / Institute" 
              className="!rounded-[24px] !bg-white dark:!bg-slate-900 !border-slate-100 dark:!border-white/5"
            />
            <MonthYearPicker 
              label="Year Completed" 
              value={edu.year} 
              onChange={(val) => updateArrayItem('education', i, 'year', val)} 
              placeholder="Select Date" 
              className="!rounded-[24px] !bg-white dark:!bg-slate-900 !border-slate-100 dark:!border-white/5"
            />
          </div>

          <input 
            type="file" 
            ref={el => { fileInputRefs.current[i] = el; }}
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, i)}
          />

          <div 
            onClick={() => triggerFileSelect(i, edu.certUrl)}
            className={`relative p-4 rounded-2xl border-2 border-dashed flex items-center justify-between transition-all ${
              !edu.certUrl ? 'cursor-pointer' : ''
            } ${
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
                  {uploadingIndex === i ? 'Uploading...' : edu.certUrl ? (edu.certFileName || 'Document Uploaded') : 'Click to upload proof'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {uploadingIndex === i ? (
                 <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              ) : edu.certUrl ? (
                <button 
                  onClick={(e) => removeFile(e, i)}
                  className="p-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                >
                  <X size={14} />
                </button>
              ) : (
                <Upload className="w-4 h-4 text-slate-300" />
              )}
            </div>
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
