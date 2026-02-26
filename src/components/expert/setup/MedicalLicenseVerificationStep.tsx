'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, ShieldCheck, Upload, CheckCircle2 } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import CustomSelect from '@/components/common/CustomSelect';
import { MonthYearPicker } from '@/components/common/MonthYearPicker';

interface MedicalLicenseVerificationStepProps {
  formData: any;
  handleUpdate: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export default function MedicalLicenseVerificationStep({ formData, handleUpdate, validationErrors }: MedicalLicenseVerificationStepProps) {
  const [uploads, setUploads] = useState<Record<string, boolean>>({
    licenseCert: !!formData.license?.licenseCertUrl,
    annualLicense: !!formData.license?.annualLicenseUrl,
  });

  const handleFileUpload = (field: string) => {
    setUploads(prev => ({ ...prev, [field]: true }));
    handleUpdate('license', { ...formData.license, [`${field}Url`]: `mock-url-${field}` });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Medical License Verification</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Provide your professional license details for MDCN verification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          id="licenseNumber"
          label="Medical License Number"
          required
          value={formData.license?.licenseNumber || ''}
          onChange={(e) => handleUpdate('license', { ...formData.license, licenseNumber: e.target.value })}
          placeholder="e.g. MDCN/R/12345"
          prefixIcon={<FileText className="w-4 h-4 text-slate-400" />}
          error={validationErrors.licenseNumber}
        />
        <MonthYearPicker
          label="Date of License Issuance"
          required
          value={formData.license?.issuanceYear || ''}
          onChange={(val) => handleUpdate('license', { ...formData.license, issuanceYear: val })}
          placeholder="Select Month/Year"
          error={validationErrors.issuanceYear}
        />
        <BaseInput
          id="expiryDate"
          label="License Expiry Date"
          type="date"
          required
          value={formData.license?.expiryDate || ''}
          onChange={(e) => handleUpdate('license', { ...formData.license, expiryDate: e.target.value })}
          prefixIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          error={validationErrors.expiryDate}
        />
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Practicing Status</label>
          <CustomSelect
            options={[
              { value: 'active', label: 'Active / Practicing' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'retired', label: 'Retired' }
            ]}
            value={formData.license?.practicingStatus || 'active'}
            onChange={(val) => handleUpdate('license', { ...formData.license, practicingStatus: val })}
            placeholder="Select Status"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MDCN License Certificate */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">MDCN License Certificate</label>
          <div 
            onClick={() => handleFileUpload('licenseCert')}
            className={`p-6 rounded-2xl border-2 border-dashed flex items-center gap-4 cursor-pointer transition-all ${
              uploads.licenseCert 
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
            }`}
          >
            <div className={`p-3 rounded-xl ${uploads.licenseCert ? 'bg-emerald-100' : 'bg-slate-100'}`}>
              {uploads.licenseCert ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <Upload className="w-6 h-6 text-slate-400" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Upload Certificate</p>
              <p className="text-[10px] text-slate-500">PDF, JPG, or PNG</p>
            </div>
          </div>
        </div>

        {/* Annual Practicing License */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Annual Practicing License</label>
          <div 
            onClick={() => handleFileUpload('annualLicense')}
            className={`p-6 rounded-2xl border-2 border-dashed flex items-center gap-4 cursor-pointer transition-all ${
              uploads.annualLicense 
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
            }`}
          >
            <div className={`p-3 rounded-xl ${uploads.annualLicense ? 'bg-emerald-100' : 'bg-slate-100'}`}>
              {uploads.annualLicense ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <Upload className="w-6 h-6 text-slate-400" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Upload Current License</p>
              <p className="text-[10px] text-slate-500">PDF, JPG, or PNG</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
