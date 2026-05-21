'use client';

import React from 'react';
import { useRouter } from '@/i18n/routing';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Loader2, UserCircle, Stethoscope, Leaf, Building2, AlertCircle, Check, ChevronLeft, Crown, RefreshCw } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useTranslations } from 'next-intl';

import ReferralStep from '@/components/onboarding/steps/ReferralStep';
import IdentityStep from '@/components/onboarding/steps/IdentityStep';
import HospitalIdentityStep from '@/components/onboarding/steps/HospitalIdentityStep';
import ProfessionalIdentityStep from '@/components/onboarding/steps/ProfessionalIdentityStep';
import VerificationStep from '@/components/onboarding/steps/VerificationStep';
import RoleStep from '@/components/onboarding/steps/RoleStep';
import LocationStep from '@/components/onboarding/steps/LocationStep';
import HospitalLocationStep from '@/components/onboarding/steps/HospitalLocationStep';
import InterestsStep from '@/components/onboarding/steps/InterestsStep';
import KYCStep from '@/components/onboarding/steps/KYCStep';
import ExpertDetailsStep from '@/components/onboarding/steps/ExpertDetailsStep';
import { ErrorBanner } from '@/components/onboarding/ErrorBanner';

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const router = useRouter();
  
  const {
    step,
    setStep,
    isLoading,
    initializing,
    validationStatus,
    fieldErrors,
    formData,
    setFormData,
    handleNext,
    handleBack,
    refreshVerification,
    reloadCurrentStep,
    toggleInterest,
    toggleChronicCondition,
    toggleFamilyHistory,
    toggleLifestyleGoal,
    allCountries,
    allStates,
    allCities
  } = useOnboarding();

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-[9px]">{t('initializing')}</p>
      </div>
    );
  }

  const stepTitles: Record<number, string> = {
    1: t('steps.referral'),
    2: t('steps.role'),
    3: t('steps.identity'),
    4: t('steps.location'),
    5: t('steps.security'),
    6: t('steps.interests'),
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <ReferralStep formData={formData} setFormData={setFormData} validationStatus={validationStatus} />;
      case 2: return <RoleStep formData={formData} setFormData={setFormData} />;
      case 3: 
        if (formData.role === 'hospital') return <HospitalIdentityStep formData={formData} setFormData={setFormData} />;
        if (formData.role === 'doctor' || formData.role === 'wellness_practitioner') return <ProfessionalIdentityStep formData={formData} setFormData={setFormData} validationStatus={validationStatus} />;
        return <IdentityStep formData={formData} setFormData={setFormData} validationStatus={validationStatus} countries={allCountries} states={allStates} cities={allCities} />;
      case 4: 
        if (formData.role === 'hospital') return <HospitalLocationStep formData={formData} setFormData={setFormData} countries={allCountries} allStates={allStates} />;
        return <LocationStep formData={formData} setFormData={setFormData} countries={allCountries} allStates={allStates} />;
      case 5: return <VerificationStep formData={formData} setFormData={setFormData} refreshVerification={refreshVerification} />;
      case 6: 
        if (formData.role === 'doctor' || formData.role === 'wellness_practitioner') {
          return <ExpertDetailsStep formData={formData} setFormData={setFormData} />;
        }
        return (
          <InterestsStep 
            formData={formData} 
            toggleInterest={toggleInterest} 
            toggleChronicCondition={toggleChronicCondition}
            toggleFamilyHistory={toggleFamilyHistory}
            toggleLifestyleGoal={toggleLifestyleGoal}
          />
        );
      default: return null;
    }
  };

  const getFlowSteps = () => {
    if (formData.role === 'hospital') return [1, 2, 3, 4, 5];
    return [1, 2, 3, 4, 5, 6];
  };

  const flowSteps = getFlowSteps();
  const totalStepsCount = flowSteps.length;
  const currentStepIndex = flowSteps.indexOf(step) + 1;
  const progress = (currentStepIndex / totalStepsCount) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors py-12 pt-24 sm:pt-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex justify-center items-start sm:items-center">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="bg-white dark:bg-[#0B1221] rounded-[32px] sm:rounded-[48px] shadow-3xl border border-slate-100 dark:border-white/5">
          {/* Header Progress */}
          <div className="px-6 sm:px-12 pt-8 sm:pt-10 pb-6 border-b border-slate-50 dark:border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  {step === 5 && <UserCircle size={20} />}
                  {step === 6 && <Leaf size={20} />}
                  {step === 1 && <ArrowRight size={20} />}
                  {step !== 1 && step !== 5 && step !== 6 && <Check size={20} />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{stepTitles[step] || t('setupTitle')}</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t('setupSubtitle')}</p>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                    <button 
                      onClick={reloadCurrentStep}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 group"
                    >
                      <RefreshCw size={10} className={`${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                      Refresh Step
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Grid Progress</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{Math.round(progress)}%</p>
              </div>
            </div>

            <div className="flex gap-2">
              {flowSteps.map((s, i) => (
                <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-white/5">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: currentStepIndex > i ? '0%' : '-100%' }}
                    className="h-full bg-blue-600"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-12 min-h-[500px] flex flex-col">
            <ErrorBanner errors={fieldErrors} title={t('attentionRequired')} />

            <div className="flex-1 relative z-20">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex items-center justify-between gap-4">
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 sm:px-8 py-4 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-slate-100 active:scale-95 disabled:opacity-50"
              >
                <ChevronLeft size={14} /> {t('back')}
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={fieldErrors.length > 0 ? { x: [0, -10, 10, -10, 10, 0], backgroundColor: ['#ef4444', '#3b82f6', '#ef4444', '#1e293b'] } : {}}
                transition={{ x: { duration: 0.4, repeat: 1 } }}
                onClick={handleNext}
                disabled={isLoading}
                className={`group relative flex items-center gap-3 px-8 sm:px-10 py-4 ${fieldErrors.length > 0 ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'} rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-blue-600 dark:hover:bg-blue-50 active:scale-95 disabled:opacity-50 overflow-hidden shadow-xl`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {step === totalStepsCount ? t('complete') : t('continue')}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
