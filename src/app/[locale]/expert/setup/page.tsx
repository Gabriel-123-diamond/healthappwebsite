'use client';

import React from 'react';
import { ExpertLayout } from '@/components/expert/ExpertLayout';
import { 
  ChevronRight, ChevronLeft, CheckCircle, Loader2, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProfessionalIdentityStep } from '@/components/expert/setup/ProfessionalIdentityStep';
import IdentityVerificationStep from '@/components/expert/setup/IdentityVerificationStep';
import MedicalLicenseVerificationStep from '@/components/expert/setup/MedicalLicenseVerificationStep';
import { EducationCertificationsStep } from '@/components/expert/setup/EducationCertificationsStep';
import PracticeInformationStep from '@/components/expert/setup/PracticeInformationStep';
import ProfessionalProfileStep from '@/components/expert/setup/ProfessionalProfileStep';
import LegalComplianceStep from '@/components/expert/setup/LegalComplianceStep';
import { useExpertSetup } from '@/hooks/useExpertSetup';

export default function ExpertSetupPage() {
  const {
    step,
    setStep,
    totalSteps,
    loading,
    saving,
    isReverting,
    error,
    formData,
    userProfile,
    validationErrors,
    handleUpdate,
    saveProgress,
    handleRevert,
    addItem,
    removeItem,
    updateArrayItem
  } = useExpertSetup();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ExpertLayout title="Expert Verification" subtitle={`Step ${step} of ${totalSteps}: Verify your professional status.`}>
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-[48px] shadow-2xl p-6 sm:p-12 border border-slate-100 dark:border-slate-700">
        
        <div className="mb-12">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">
            <span>Registration Progress</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-900 h-3 rounded-full overflow-hidden p-1">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>
        </div>

        {step === 1 && (
          <ProfessionalIdentityStep 
            formData={formData} 
            handleUpdate={handleUpdate} 
            validationErrors={validationErrors} 
            userProfile={userProfile} 
            onRevert={handleRevert}
            isReverting={isReverting}
          />
        )}
        {step === 2 && <IdentityVerificationStep formData={formData} handleUpdate={handleUpdate} validationErrors={validationErrors} />}
        {step === 3 && <MedicalLicenseVerificationStep formData={formData} handleUpdate={handleUpdate} validationErrors={validationErrors} />}
        {step === 4 && <EducationCertificationsStep formData={formData} updateArrayItem={updateArrayItem} addItem={addItem} removeItem={removeItem} validationErrors={validationErrors} />}
        {step === 5 && <PracticeInformationStep formData={formData} handleUpdate={handleUpdate} validationErrors={validationErrors} />}
        {step === 6 && <ProfessionalProfileStep formData={formData} handleUpdate={handleUpdate} validationErrors={validationErrors} />}
        {step === 7 && <LegalComplianceStep formData={formData} handleUpdate={handleUpdate} validationErrors={validationErrors} />}

        {error && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-bold uppercase tracking-tight">{error}</p>
          </div>
        )}

        <div className="mt-16 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-10">
          <motion.button 
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep(s => s - 1)} 
            disabled={step === 1 || saving}
            className="flex items-center gap-2 px-6 py-3 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-0 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => saveProgress(step < totalSteps ? step + 1 : undefined)}
            disabled={saving}
            className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all shadow-xl ${
              step === totalSteps ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02]'
            } disabled:opacity-50`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              step === totalSteps ? <><CheckCircle className="w-4 h-4" /> Submit for Review</> : <>Save & Continue <ChevronRight className="w-4 h-4" /></>
            )}
          </motion.button>
        </div>
      </div>
    </ExpertLayout>
  );
}
