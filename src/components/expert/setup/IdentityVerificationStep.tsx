'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, FileText, CheckCircle2, Loader2, Check, X, Contact, ShieldCheck } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import { userService } from '@/services/userService';

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
  const [idStatus, setIdStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  useEffect(() => {
    if (!formData.kyc?.idNumber || formData.kyc.idNumber.length < 5) {
      setIdStatus('idle');
      return;
    }
    setIdStatus('checking');
    const tid = setTimeout(async () => {
      try {
        const available = await userService.checkAvailability('idNumber', formData.kyc.idNumber.trim());
        setIdStatus(available ? 'available' : 'taken');
      } catch (e) {
        setIdStatus('idle');
      }
    }, 500);
    return () => clearTimeout(tid);
  }, [formData.kyc?.idNumber]);

  const handleFileUpload = (field: string) => {
    // Mock file upload - in reality, this would use firebase storage
    setUploads(prev => ({ ...prev, [field]: true }));
    handleUpdate('kyc', { ...formData.kyc, [`${field}Url`]: `mock-url-${field}` });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Identity Verification</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Step 1: Upload your government-issued identification documents.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-400">KYC Required</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ID Card Upload */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Government ID</label>
          <div 
            onClick={() => handleFileUpload('idCard')}
            className={`aspect-square rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-all ${
              uploads.idCard 
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 shadow-inner' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-white dark:hover:bg-slate-800 shadow-sm'
            }`}
          >
            {uploads.idCard ? (
              <>
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                <span className="text-[10px] font-black uppercase text-emerald-600">Uploaded</span>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase text-slate-400 text-center">National ID / Passport</span>
              </>
            )}
          </div>
          {validationErrors.idCard && <p className="text-[9px] text-red-500 font-black uppercase mt-1 tracking-widest">{validationErrors.idCard}</p>}
        </div>

        {/* Selfie Upload */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Selfie holding ID</label>
          <div 
            onClick={() => handleFileUpload('selfie')}
            className={`aspect-square rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-all ${
              uploads.selfie 
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 shadow-inner' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-white dark:hover:bg-slate-800 shadow-sm'
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
          {validationErrors.selfie && <p className="text-[9px] text-red-500 font-black uppercase mt-1 tracking-widest">{validationErrors.selfie}</p>}
        </div>

        {/* Passport Photo Upload */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Passport Photograph</label>
          <div 
            onClick={() => handleFileUpload('passportPhoto')}
            className={`aspect-square rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-all ${
              uploads.passportPhoto 
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 shadow-inner' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-white dark:hover:bg-slate-800 shadow-sm'
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

      <div className="space-y-6">
        <div className="relative group">
          <BaseInput
            id="idNumber"
            label="ID / Passport Number"
            required
            value={formData.kyc?.idNumber || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdate('kyc', { ...formData.kyc, idNumber: e.target.value })}
            placeholder="National ID or Passport number"
            prefixIcon={<Contact className="w-4 h-4 text-slate-400" />}
            className={idStatus === 'taken' ? 'border-red-500 ring-2 ring-red-100 !rounded-2xl' : '!rounded-2xl'}
          />
          <div className="absolute right-4 top-[52px] flex items-center gap-2">
            {idStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            {idStatus === 'available' && <Check className="w-4 h-4 text-emerald-500" />}
            {idStatus === 'taken' && <X className="w-4 h-4 text-red-500" />}
          </div>
          {idStatus === 'taken' && (
            <p className="text-[10px] font-black text-red-500 uppercase mt-2 ml-2 tracking-widest">Already registered!</p>
          )}
          {validationErrors.idNumber && <p className="text-[10px] text-red-500 font-black uppercase mt-2 ml-2 tracking-widest">{validationErrors.idNumber}</p>}
        </div>
      </div>

      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-200 dark:border-slate-800 flex items-start gap-4 shadow-sm">
        <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
          <ShieldCheck size={18} />
        </div>
        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">
          Your personal identification number and documents are encrypted and only used for professional verification. Contact numbers are not displayed during this stage.
        </p>
      </div>
    </motion.div>
  );
}
