'use client';

import React from 'react';
import { useRouter } from '@/i18n/routing';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Loader2, UserCircle, Stethoscope, Leaf, Building2, AlertCircle, ChevronLeft } from 'lucide-react';
import OnboardingSidebar from '@/components/onboarding/OnboardingSidebar';
import StepRenderer from '@/components/onboarding/StepRenderer';
import { ErrorBanner } from '@/components/onboarding/ErrorBanner';
import { useTranslations } from 'next-intl';
import { countries } from '@/lib/countries';
import { useOnboarding } from '@/hooks/useOnboarding';
import { ONBOARDING_STEPS } from '@/types';

import { useSearchParams } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const {
    step,
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

  const isExpert = ['doctor', 'herbal_practitioner', 'hospital'].includes(formData.role);

  const steps = ONBOARDING_STEPS.filter(s => {
    // Hide Expert Details (step 5) for non-expert users
    if (s.id === 'expert') return isExpert;
    // Hide Role selection (step 4) if already coming from an expert link
    if (s.id === 'role' && isExpert && searchParams.get('role')) return false;
    return true;
  }).map((s, idx) => ({ ...s, number: idx + 1 }));

  const roles = [
    { id: "user", label: "General User", icon: UserCircle, desc: "I am looking for health information." },
    { id: "doctor", label: "Doctor", icon: Stethoscope, desc: "I am a verified medical professional." },
    { id: "herbal_practitioner", label: "Herbal Practitioner", icon: Leaf, desc: "I am a traditional medicine practitioner." },
    { id: "hospital", label: "Hospital", icon: Building2, desc: "I represent a healthcare facility." },
  ];

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
          </div>
        </div>
        <p className="mt-6 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing Identity</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-8 pt-24 sm:pt-32 transition-colors duration-500 relative overflow-hidden">
      {/* Dynamic Background decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 dark:bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 dark:bg-indigo-600/5 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[850px] border border-slate-100 dark:border-slate-800 relative z-10 transition-colors duration-500"
      >
        <OnboardingSidebar currentStep={step} steps={steps} />
        
        <div className="p-8 sm:p-12 md:p-20 md:w-2/3 flex flex-col h-full bg-white dark:bg-slate-900 transition-colors duration-500 relative">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <ErrorBanner errors={fieldErrors} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-full mt-6"
              >
                <StepRenderer 
                  step={step}
                  formData={formData}
                  setFormData={setFormData}
                  validationStatus={validationStatus}
                  countries={allCountries}
                  allStates={allStates}
                  allCities={allCities}
                  roles={roles}
                  t={t}
                  toggleInterest={toggleInterest}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12 space-y-8">
            <div className="flex justify-between items-center gap-6">
              <button 
                onClick={handleBack} 
                className="group flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-900 dark:hover:text-white transition-all px-6 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                {step === 1 ? t('auth.backToSignUp') : t('common.previous')}
              </button>
              
              <button 
                onClick={handleNext} 
                disabled={isLoading || (step === 2 && (validationStatus.username === 'taken' || validationStatus.phone === 'taken' || validationStatus.name === 'taken'))} 
                className="relative overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-14 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 shadow-2xl shadow-slate-900/20 dark:shadow-white/5 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {step === 7 ? t('auth.launchProfile') : t('common.continue')}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                {/* Gloss effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
