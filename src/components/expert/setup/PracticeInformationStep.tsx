'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Briefcase, Stethoscope, CheckCircle2, Upload, Loader2, X } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import CustomSelect from '@/components/common/CustomSelect';
import { ExpertPhoneManager } from '@/components/expert/ExpertPhoneManager';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface PracticeInformationStepProps {
  formData: any;
  handleUpdate: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export default function PracticeInformationStep({ formData, handleUpdate, validationErrors }: PracticeInformationStepProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Authentication required to upload documents.");
      return;
    }

    setIsUploading(true);
    try {
      const timestamp = Date.now();
      // Phase 14: Client-side storage protection (10MB)
      if (file.size > 10 * 1024 * 1024) throw new Error("File exceeds 10MB limit.");
      const storageRef = ref(storage, `verifications/${user.uid}/practice_${timestamp}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      handleUpdate('practice', { ...formData.practice, hospitalIdUrl: url, hospitalIdFileName: file.name });
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdate('practice', { ...formData.practice, hospitalIdUrl: null, hospitalIdFileName: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileSelect = () => {
    if (!formData.practice?.hospitalIdUrl && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Practice Information</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Provide details about your current clinical or hospital practice.</p>
      </div>

      <div className="space-y-6">
        <BaseInput
          id="hospitalName"
          label="Hospital / Clinic Name"
          required
          value={formData.practice?.hospitalName || ''}
          onChange={(e) => handleUpdate('practice', { ...formData.practice, hospitalName: e.target.value })}
          placeholder="e.g. Lagos University Teaching Hospital"
          prefixIcon={<Building2 className="w-4 h-4 text-slate-400" />}
          error={validationErrors.hospitalName}
        />
        <BaseInput
          id="hospitalAddress"
          label="Hospital Address"
          required
          value={formData.practice?.hospitalAddress || ''}
          onChange={(e) => handleUpdate('practice', { ...formData.practice, hospitalAddress: e.target.value })}
          placeholder="Full clinical address"
          prefixIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          error={validationErrors.hospitalAddress}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            id="yearsExperience"
            label="Years of Experience"
            type="number"
            required
            value={formData.practice?.yearsExperience || ''}
            onChange={(e) => handleUpdate('practice', { ...formData.practice, yearsExperience: e.target.value })}
            placeholder="e.g. 10"
            prefixIcon={<Briefcase className="w-4 h-4 text-slate-400" />}
            error={validationErrors.yearsExperience}
          />
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Consultation Type</label>
            <CustomSelect
              options={[
                { value: 'physical', label: 'Physical Only' },
                { value: 'telemedicine', label: 'Telemedicine Only' },
                { value: 'both', label: 'Both' }
              ]}
              value={formData.practice?.consultationType || 'both'}
              onChange={(val) => handleUpdate('practice', { ...formData.practice, consultationType: val })}
              placeholder="Select Type"
            />
          </div>
        </div>

        {/* Optional Hospital ID */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Hospital ID / Employment Letter (Optional)</label>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <div 
            onClick={triggerFileSelect}
            className={`relative p-6 rounded-2xl border-2 border-dashed flex items-center gap-4 transition-all ${!formData.practice?.hospitalIdUrl ? 'cursor-pointer' : ''} ${
              formData.practice?.hospitalIdUrl 
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
            }`}
          >
            {formData.practice?.hospitalIdUrl && (
              <button 
                onClick={removeFile}
                className="absolute right-4 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-400 hover:text-red-500 transition-colors z-10"
              >
                <X size={14} />
              </button>
            )}

            <div className={`p-3 rounded-xl ${formData.practice?.hospitalIdUrl ? 'bg-emerald-100' : 'bg-slate-100'}`}>
              {isUploading ? <Loader2 className="w-6 h-6 text-blue-500 animate-spin" /> : formData.practice?.hospitalIdUrl ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <Upload className="w-6 h-6 text-slate-400" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {isUploading ? 'Uploading...' : formData.practice?.hospitalIdUrl ? (formData.practice?.hospitalIdFileName || 'Verification Uploaded') : 'Upload ID Card'}
              </p>
              {!formData.practice?.hospitalIdUrl && !isUploading && (
                <p className="text-[10px] text-slate-500">PDF, JPG, or PNG</p>
              )}
            </div>
          </div>
        </div>

        {/* Communication Nodes */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
              <Stethoscope size={18} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Communication Nodes</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Manage active contact channels for consultations</p>
            </div>
          </div>

          <ExpertPhoneManager 
            phones={formData.phones} 
            onChange={(p) => handleUpdate('phones', p)}
            primaryPhoneDisabled={true}
          />
          {validationErrors.phones && <p className="text-[10px] text-red-500 font-black uppercase mt-4 tracking-widest">{validationErrors.phones}</p>}
        </div>
      </div>
    </motion.div>
  );
}
