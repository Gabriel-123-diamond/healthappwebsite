'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Upload, AlertCircle, EyeOff, Loader2, Check } from 'lucide-react';

interface KYCStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function KYCStep({ formData, setFormData }: KYCStepProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Note: For a real app, this would use Firebase Storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setFormData({ ...formData, kycDocument: "uploaded_doc_url" });
      setIsUploading(false);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 sm:space-y-10 min-h-[700px]">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          Step 1: Secure KYC Verification
        </div>
        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Protecting the Network</h3>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
          To ensure platform integrity, health professionals are required to complete a secure identity verification.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-5 sm:p-10 shadow-sm space-y-10 transition-colors duration-500">
        
        <div className="flex items-start gap-5 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="p-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl">
            <EyeOff size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Confidential Protocol</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Your contact information (Phone & Email) will remain strictly hidden from the public to prevent unauthorized access.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Identify Document Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {['National ID', 'Passport', 'License Card'].map(type => (
                 <button 
                  key={type}
                  onClick={() => setFormData({...formData, kycDocType: type})}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    formData.kycDocType === type 
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                      : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                  }`}
                 >
                   <span className="text-sm font-black uppercase tracking-wider">{type}</span>
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Upload Front & Back</label>
            <label className="relative flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[40px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group">
              <input type="file" className="hidden" onChange={handleFileUpload} />
              <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                {isUploading ? <Loader2 className="w-8 h-8 animate-spin text-blue-600" /> : <Upload className="w-8 h-8 text-slate-400" />}
              </div>
              <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-2">
                {formData.kycDocument ? "Document Captured" : "Drag & Drop or Browse"}
              </p>
              <p className="text-slate-400 font-medium text-[10px]">JPG, PNG or PDF (Max 5MB)</p>
              {formData.kycDocument && (
                <div className="absolute top-4 right-4 p-2 bg-emerald-500 text-white rounded-full">
                   <Check size={14} strokeWidth={4} />
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="p-6 bg-blue-600/5 rounded-3xl border border-blue-600/10 flex items-start gap-4">
           <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
           <p className="text-[11px] font-medium text-blue-800 dark:text-blue-300 leading-relaxed">
             AI-powered verification will analyze your document to ensure authenticity. This is mandatory for doctors to be pushed to the expert network.
           </p>
        </div>
      </div>
    </motion.div>
  );
}
