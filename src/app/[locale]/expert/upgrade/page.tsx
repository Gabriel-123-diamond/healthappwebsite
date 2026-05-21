'use client';

import React from 'react';
import { useRouter } from '@/i18n/routing';
import { 
  ShieldCheck, 
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import NiceModal from '@/components/common/NiceModal';
import { useExpertUpgrade } from '@/hooks/expert/useExpertUpgrade';
import { TierSelectionStep } from '@/components/expert/upgrade/TierSelectionStep';
import { VerificationFormStep } from '@/components/expert/upgrade/VerificationFormStep';
import { PendingStatusStep } from '@/components/expert/upgrade/PendingStatusStep';

export default function ExpertUpgradePage() {
  const {
    userProfile,
    loading,
    step,
    setStep,
    targetTier,
    isSubmitting,
    formData,
    setFormData,
    modalConfig,
    setModalConfig,
    handleTierSelect,
    handleFormSubmit
  } = useExpertUpgrade();
  
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const role = userProfile?.role || 'doctor';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-20 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-12">
          <button 
            onClick={() => step === 1 ? router.push('/expert/dashboard') : setStep(1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:white transition-colors uppercase font-black text-[10px] tracking-widest mb-8"
          >
            <ChevronLeft size={14} />
            {step === 1 ? 'Back to Dashboard' : 'View Tiers'}
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20 text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Network Authority</h1>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Scale Your Clinical Node</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <TierSelectionStep 
              role={role} 
              onTierSelect={handleTierSelect} 
              currentTier={userProfile?.tier || 'basic'}
            />
          )}

          {step === 2 && (
            <VerificationFormStep
              targetTier={targetTier}
              formData={formData}
              setFormData={setFormData}
              isSubmitting={isSubmitting}
              role={role}
              onSubmit={handleFormSubmit}
            />
          )}

          {step === 3 && (
            <PendingStatusStep onReturn={() => router.push('/expert/dashboard')} />
          )}
        </AnimatePresence>

        <NiceModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          title={modalConfig.title}
          description={modalConfig.description}
          type={modalConfig.type}
        />
      </div>
    </div>
  );
}
