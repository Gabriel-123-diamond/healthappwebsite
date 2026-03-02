'use client';

import React from 'react';
import { useRouter } from '@/i18n/routing';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Loader2, UserCircle, Stethoscope, Leaf, Building2, AlertCircle, Check, ChevronLeft } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useTranslations } from 'next-intl';

import ReferralStep from '@/components/onboarding/steps/ReferralStep';
import IdentityStep from '@/components/onboarding/steps/IdentityStep';
import VerificationStep from '@/components/onboarding/steps/VerificationStep';
import InterestsStep from '@/components/onboarding/steps/InterestsStep';
import RoleStep from '@/components/onboarding/steps/RoleStep';
import LocationStep from '@/components/onboarding/steps/LocationStep';
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
    toggleInterest,
    allCountries,
    allStates,
    allCities
  } = useOnboarding();

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-[9px]">Initializing Platform...</p>
      </div>
    );
  }

  const stepTitles: Record<number, string> = {
    1: t('steps.referral'),
    2: t('steps.identity'),
    3: t('steps.security'),
    4: t('steps.location'),
    5: t('steps.interests'),
    6: t('steps.role')
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <ReferralStep formData={formData} setFormData={setFormData} validationStatus={validationStatus} />;
      case 2: return <IdentityStep formData={formData} setFormData={setFormData} validationStatus={validationStatus} countries={allCountries} states={allStates} cities={allCities} />;
      case 3: return <VerificationStep formData={formData} setFormData={setFormData} />;
      case 4: return <LocationStep formData={formData} setFormData={setFormData} countries={allCountries} allStates={allStates} />;
      case 5: return <InterestsStep formData={formData} toggleInterest={toggleInterest} />;
      case 6: return <RoleStep formData={formData} setFormData={setFormData} />;
      default: return null;
    }
  };

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors py-12 pt-32 sm:pt-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="bg-white dark:bg-[#0B1221] rounded-[48px] shadow-3xl border border-slate-100 dark:border-white/5 overflow-hidden">
          {/* Header Progress */}
          <div className="px-8 sm:px-12 pt-10 pb-6 border-b border-slate-50 dark:border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  {step === 5 && <UserCircle size={20} />}
                  {step === 1 && <ArrowRight size={20} />}
                  {step !== 1 && step !== 5 && <Check size={20} />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('setupTitle')}</h2>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t('setupSubtitle')}</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Grid Progress</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{Math.round(progress)}%</p>
              </div>
            </div>

            <div className="flex gap-2">
              {[...Array(totalSteps)].map((_, i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-white/5">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: step > i ? '0%' : '-100%' }}
                    className="h-full bg-blue-600"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 sm:p-12 min-h-[500px] flex flex-col">
            <ErrorBanner errors={fieldErrors} title={t('attentionRequired')} />

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex items-center justify-between gap-4">
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-4 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-slate-100 active:scale-95 disabled:opacity-50"
              >
                <ChevronLeft size={14} /> {t('back')}
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={isLoading}
                className="group relative flex items-center gap-3 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-blue-600 dark:hover:bg-blue-50 active:scale-95 disabled:opacity-50 overflow-hidden shadow-xl"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {step === totalSteps ? t('complete') : t('continue')}
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
