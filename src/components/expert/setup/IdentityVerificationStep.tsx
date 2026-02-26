'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, MapPin, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';

interface IdentityVerificationStepProps {
  formData: any;
  handleUpdate: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export default function IdentityVerificationStep({ formData, handleUpdate, validationErrors }: IdentityVerificationStepProps) {
  const [uploads, setUploads] = useState<Record<string, boolean>>({
    idCard: !!formData.kyc?.idCardUrl,
    selfie: !!formData.kyc?.selfieUrl,
    passportPhoto: !!formData.kyc?.passportPhotoUrl,
  });

  const handleFileUpload = (field: string) => {
    // Mock file upload - in reality, this would use firebase storage
    setUploads(prev => ({ ...prev, [field]: true }));
    handleUpdate('kyc', { ...formData.kyc, [`${field}Url`]: `mock-url-${field}` });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Identity Verification (KYC)</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Please provide your identification documents for verification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ID Card Upload */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Government ID</label>
          <div 
            onClick={() => handleFileUpload('idCard')}
            className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-all ${
              uploads.idCard 
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
            }`}
          >
            {uploads.idCard ? (
              <>
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                <span className="text-[10px] font-black uppercase text-emerald-600">Uploaded</span>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-[10px] font-black uppercase text-slate-400 text-center">National ID / Passport</span>
              </>
            )}
          </div>
        </div>

        {/* Selfie Upload */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Selfie holding ID</label>
          <div 
            onClick={() => handleFileUpload('selfie')}
            className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-all ${
              uploads.selfie 
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
            }`}
          >
            {uploads.selfie ? (
              <>
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                <span className="text-[10px] font-black uppercase text-emerald-600">Uploaded</span>
              </>
            ) : (
              <>
                <Camera className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-[10px] font-black uppercase text-slate-400 text-center">Selfie with ID</span>
              </>
            )}
          </div>
        </div>

        {/* Passport Photo Upload */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Passport Photograph</label>
          <div 
            onClick={() => handleFileUpload('passportPhoto')}
            className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-all ${
              uploads.passportPhoto 
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
            }`}
          >
            {uploads.passportPhoto ? (
              <>
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                <span className="text-[10px] font-black uppercase text-emerald-600">Uploaded</span>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-[10px] font-black uppercase text-slate-400 text-center">Recent Photo</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          id="dob"
          label="Date of Birth"
          type="date"
          required
          value={formData.kyc?.dob || ''}
          onChange={(e) => handleUpdate('kyc', { ...formData.kyc, dob: e.target.value })}
          prefixIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          error={validationErrors.dob}
        />
        <BaseInput
          id="address"
          label="Residential Address"
          required
          value={formData.kyc?.address || ''}
          onChange={(e) => handleUpdate('kyc', { ...formData.kyc, address: e.target.value })}
          placeholder="Full residential address"
          prefixIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          error={validationErrors.address}
        />
      </div>
    </motion.div>
  );
}
