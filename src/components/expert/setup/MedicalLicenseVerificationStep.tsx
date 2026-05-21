'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Upload, CheckCircle2, Loader2, X, Check } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import CustomSelect from '@/components/common/CustomSelect';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface MedicalLicenseVerificationStepProps {
  formData: any;
  handleUpdate: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export default function MedicalLicenseVerificationStep({ formData, handleUpdate, validationErrors }: MedicalLicenseVerificationStepProps) {
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
      const storageRef = ref(storage, `verifications/${user.uid}/license_${timestamp}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      handleUpdate('license', { ...formData.license, licenseUrl: url, licenseFileName: file.name });
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdate('license', { ...formData.license, licenseUrl: null, licenseFileName: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileSelect = () => {
    if (!formData.license?.licenseUrl && !isUploading) {
      fileInputRef.current?.click();
    }
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
          placeholder="e.g. MED-12345678"
          prefixIcon={<FileText className="w-5 h-5 text-slate-400" />}
          error={validationErrors.licenseNumber}
          className="!rounded-[24px] !bg-white dark:!bg-slate-900 !border-slate-100 dark:!border-white/5"
        />

        <CustomDatePicker
          label="Issuance Year"
          required
          value={formData.license?.issuanceYear || ''}
          onChange={(val) => handleUpdate('license', { ...formData.license, issuanceYear: val })}
          error={validationErrors.issuanceYear}
          views={['year']}
          openTo="year"
          maxDate={new Date()}
          placeholder="Select Year"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          {!formData.license?.noExpiry ? (
            <CustomDatePicker
              label="License Expiry Date"
              required
              value={formData.license?.expiryDate || ''}
              onChange={(val) => handleUpdate('license', { ...formData.license, expiryDate: val })}
              error={validationErrors.expiryDate}
              minDate={new Date()}
              placeholder="Select Future Date"
            />
          ) : (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
                License Expiry Date <span className="text-red-500">*</span>
              </label>
              <div className="px-6 py-4 bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-900/30 rounded-[24px] flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-xl text-white">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Lifetime License</span>
              </div>
            </div>
          )}
          
          <div 
            onClick={() => {
              const noExpiry = !formData.license?.noExpiry;
              handleUpdate('license', { 
                ...formData.license, 
                noExpiry,
                expiryDate: noExpiry ? 'lifetime' : '' 
              });
            }}
            className="flex items-center gap-2 cursor-pointer group ml-1"
          >
            <div className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${formData.license?.noExpiry ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-700 group-hover:border-blue-400'}`}>
              {formData.license?.noExpiry && <Check size={10} className="text-white font-black" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors">This license does not expire</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-5 h-5 text-blue-500" /> Current Status
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
            className="!rounded-[24px] !bg-white dark:!bg-slate-900 !border-slate-100 dark:!border-white/5"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
          <Upload className="w-4 h-4 text-blue-500" /> License Document
        </label>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
        
        <div 
          onClick={triggerFileSelect}
          className={`relative p-10 rounded-[32px] border-2 border-dashed transition-all ${!formData.license?.licenseUrl ? 'cursor-pointer' : ''} flex flex-col items-center justify-center gap-4 ${
            formData.license?.licenseUrl 
              ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500/30' 
              : validationErrors.licenseCert
                ? 'bg-red-50 dark:bg-red-900/10 border-red-500/30'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500/30 shadow-sm'
          }`}
        >
          {formData.license?.licenseUrl && (
            <button 
              onClick={removeFile}
              className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-400 hover:text-red-500 transition-colors z-10"
            >
              <X size={16} />
            </button>
          )}

          <div className="flex flex-col items-center text-center gap-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
              formData.license?.licenseUrl ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'
            }`}>
              {isUploading ? (
                <Loader2 size={32} className="animate-spin text-blue-500" />
              ) : formData.license?.licenseUrl ? (
                <CheckCircle2 size={32} />
              ) : (
                <Upload size={32} />
              )}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                {isUploading ? 'Uploading securely...' : formData.license?.licenseUrl ? (formData.license?.licenseFileName || 'License Uploaded') : 'Upload Current License'}
              </p>
              {!formData.license?.licenseUrl && !isUploading && (
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">PDF, JPG, or PNG</p>
              )}
            </div>
          </div>
        </div>
        {validationErrors.licenseCert && <p className="text-[10px] text-red-500 font-black uppercase mt-2 ml-2 tracking-widest">{validationErrors.licenseCert}</p>}
      </div>
    </motion.div>
  );
}
