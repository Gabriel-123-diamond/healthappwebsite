'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Upload, FileText, CheckCircle2, Loader2, AtSign, Check, X, Building2, MapPin, Globe, CreditCard } from 'lucide-react';
import CustomSelect from '../../common/CustomSelect';
import { FormFieldWrapper } from '../FormFieldWrapper';
import { useTranslations } from 'next-intl';

interface KYCStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function KYCStep({ formData, setFormData }: KYCStepProps) {
  const t = useTranslations('onboarding.kyc');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFormData({ ...formData, kyc: { ...formData.kyc, documentUrl: 'uploaded_url' } });
    setUploading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="space-y-10"
    >
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 shadow-sm">
          <Shield size={12} />
          {t('title')}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Trust <span className="text-blue-600">&</span> Safety.
          </h3>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <FormFieldWrapper label="Document Type" icon={<FileText size={14} />} isRequired>
          <CustomSelect
            value={formData.kyc?.documentType}
            onChange={(val) => setFormData({ ...formData, kyc: { ...formData.kyc, documentType: val } })}
            options={[
              { value: 'id', label: 'Government ID' },
              { value: 'passport', label: 'Passport' },
              { value: 'license', label: 'Medical License' },
            ]}
            placeholder="Select document type"
            className="!rounded-2xl !py-4"
          />
        </FormFieldWrapper>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
            <Upload size={14} /> Upload Document <span className="text-red-500">*</span>
          </label>
          
          <div className="relative">
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div className={`p-12 rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${
              formData.kyc?.documentUrl 
                ? 'bg-emerald-500/5 border-emerald-500/30' 
                : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-500/30'
            }`}>
              {uploading ? (
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              ) : formData.kyc?.documentUrl ? (
                <>
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="text-emerald-600 font-black uppercase tracking-widest text-[10px]">Upload Complete</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-900 dark:text-white font-bold">Drop your file here or click to browse</p>
                    <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-black">PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
