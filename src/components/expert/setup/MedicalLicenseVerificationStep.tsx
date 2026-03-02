'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, ShieldCheck, Upload, CheckCircle2 } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import CustomSelect from '@/components/common/CustomSelect';
import CustomDatePicker from '@/components/common/CustomDatePicker';

interface MedicalLicenseVerificationStepProps {
  formData: any;
  handleUpdate: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export default function MedicalLicenseVerificationStep({ formData, handleUpdate, validationErrors }: MedicalLicenseVerificationStepProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      handleUpdate('license', { ...formData.license, licenseUrl: 'mock-license-url' });
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Medical Credentials</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Verify your professional medical license to practice on the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          id="licenseNumber"
          label="Medical License Number"
          required
          value={formData.license?.licenseNumber || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdate('license', { ...formData.license, licenseNumber: e.target.value })}
          prefixIcon={<FileText className="w-4 h-4 text-slate-400" />}
          error={validationErrors.licenseNumber}
        />

        <BaseInput
          id="issuanceYear"
          label="Issuance Year"
          required
          value={formData.license?.issuanceYear || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdate('license', { ...formData.license, issuanceYear: e.target.value })}
          prefixIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          error={validationErrors.issuanceYear}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomDatePicker
          label="License Expiry Date"
          required
          value={formData.license?.expiryDate || ''}
          onChange={(val) => handleUpdate('license', { ...formData.license, expiryDate: val })}
          error={validationErrors.expiryDate}
        />

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-blue-500" /> Current Status
          </label>
          <CustomSelect
            value={formData.license?.practicingStatus || 'active'}
            onChange={(val) => handleUpdate('license', { ...formData.license, practicingStatus: val })}
            options={[
              { value: 'active', label: 'Currently Practicing' },
              { value: 'inactive', label: 'Inactive / On Leave' },
              { value: 'student', label: 'In Residency / Student' },
            ]}
            placeholder="Select Status"
            className="!rounded-2xl !py-4"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
          <Upload className="w-4 h-4 text-blue-500" /> License Document
        </label>
        
        <div 
          onClick={handleFileUpload}
          className={`p-10 rounded-[32px] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
            formData.license?.licenseUrl 
              ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500/30' 
              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500/30 shadow-sm'
          }`}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
              formData.license?.licenseUrl ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'
            }`}>
              {formData.license?.licenseUrl ? <CheckCircle2 size={32} /> : <Upload size={32} />}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Upload Current License</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">PDF, JPG, or PNG</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
