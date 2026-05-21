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
import { ExpertTierSelection } from '@/components/expert/upgrade/ExpertTierSelection';

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
    updateArrayItem,
    isStepComplete,
    getNextAvailableStep,
    isUpgrading
  } = useExpertSetup();

  const handleTierSelect = (tier: any) => {
    handleUpdate('tier', tier);
    setStep(getNextAvailableStep(1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const stepTitles: Record<number, string> = {
    1: "Choose Authority Level",
    2: "Identity Verification",
    3: "Professional Identity",
    4: "Medical Credentials",
    5: "Education & Certifications",
    6: "Practice Information",
    7: "Professional Profile",
    8: "Legal Compliance",
  };

  const currentTotalSteps = 8;

  return (
    <ExpertLayout title="Expert Verification" subtitle={`Step ${step} of ${currentTotalSteps}: ${stepTitles[step] || 'Verify your professional status.'}`}>
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-12">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">
            <span>{isUpgrading ? 'Upgrade Progress' : 'Registration Progress'}</span>
            <span>{Math.round((step / currentTotalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-900 h-3 rounded-full overflow-hidden p-1">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${(step / currentTotalSteps) * 100}%` }} />
          </div>
          
          {isUpgrading && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center gap-3 border border-blue-100 dark:border-blue-900/30">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Upgrade Mode: Auto-skipping verified credentials</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[48px] shadow-2xl p-6 sm:p-12 border border-slate-100 dark:border-slate-700">
          {step === 1 && (
            <ExpertTierSelection 
              onUpgrade={handleTierSelect} 
              isSubmitting={saving} 
            />
          )}

          {step === 2 && (
            <IdentityVerificationStep 
              formData={formData} 
              handleUpdate={handleUpdate} 
              validationErrors={validationErrors} 
            />
          )}
          {step === 3 && (
            <ProfessionalIdentityStep 
              formData={formData} 
              handleUpdate={handleUpdate} 
              validationErrors={validationErrors} 
              userProfile={userProfile} 
              onRevert={handleRevert}
              isReverting={isReverting}
            />
          )}
          {step === 4 && <MedicalLicenseVerificationStep formData={formData} handleUpdate={handleUpdate} validationErrors={validationErrors} />}
          {step === 5 && <EducationCertificationsStep formData={formData} updateArrayItem={updateArrayItem} addItem={addItem} removeItem={removeItem} validationErrors={validationErrors} />}
          {step === 6 && <PracticeInformationStep formData={formData} handleUpdate={handleUpdate} validationErrors={validationErrors} />}
          {step === 7 && <ProfessionalProfileStep formData={formData} handleUpdate={handleUpdate} validationErrors={validationErrors} />}
          {step === 8 && <LegalComplianceStep formData={formData} handleUpdate={handleUpdate} validationErrors={validationErrors} />}

          {error && (
            <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          {step > 1 && (
            <div className="mt-16 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-10">
              <motion.button 
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(s => getNextAvailableStep(s, 'backward'))} 
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => saveProgress(step < currentTotalSteps ? getNextAvailableStep(step, 'forward') : undefined)}
                disabled={saving}
                className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all shadow-xl ${
                  step === currentTotalSteps ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:scale-[1.02]'
                } disabled:opacity-50`}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  step === currentTotalSteps ? <><CheckCircle className="w-4 h-4" /> Submit for Review</> : <>Save & Continue <ChevronRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </ExpertLayout>
  );
}
