'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Loader2, UserCircle, Stethoscope, Leaf, Building2, AlertCircle } from 'lucide-react';
import OnboardingSidebar from '@/components/onboarding/OnboardingSidebar';
import StepRenderer from '@/components/onboarding/StepRenderer';
import { useTranslations } from 'next-intl';
import { countries } from '@/lib/countries';
import { useOnboarding } from '@/hooks/useOnboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const t = useTranslations();
  const {
    step,
    setStep,
    isLoading,
    initializing,
    locationData,
    validationStatus,
    fieldErrors,
    formData,
    setFormData,
    requestLocation,
    handleNext,
    toggleInterest
  } = useOnboarding();

  const steps = [
    { number: 1, title: "Referral" },
    { number: 2, title: "Identity" },
    { number: 3, title: "Professional Role" },
    { number: 4, title: "Location" },
    { number: 5, title: "Interests" }
  ];

  const roles = [
    { id: "user", label: "General User", icon: UserCircle, desc: "I am looking for health information." },
    { id: "doctor", label: "Doctor", icon: Stethoscope, desc: "I am a verified medical professional." },
    { id: "herbalist", label: "Herbalist", icon: Leaf, desc: "I am a traditional medicine practitioner." },
    { id: "hospital", label: "Hospital", icon: Building2, desc: "I represent a healthcare facility." },
  ];

  if (initializing) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-5xl w-full bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[750px]">
        <OnboardingSidebar currentStep={step} steps={steps} />
        
        <div className="p-10 md:p-20 md:w-2/3 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto pr-4 -mr-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <AnimatePresence mode="wait">
              <StepRenderer 
                step={step}
                formData={formData}
                setFormData={setFormData}
                validationStatus={validationStatus}
                countries={countries}
                roles={roles}
                locationData={locationData}
                requestLocation={requestLocation}
                t={t}
                toggleInterest={toggleInterest}
              />
            </AnimatePresence>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {fieldErrors.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Please fix the following:</p>
                  <ul className="text-sm text-red-500 font-medium">
                    {fieldErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-16 flex justify-between items-center">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : router.push('/auth/signup')} 
              className="text-slate-400 font-bold hover:text-slate-900 transition-colors px-6 py-2 rounded-xl hover:bg-slate-50"
            >
              {step === 1 ? t('auth.backToSignUp') : t('common.previous')}
            </button>
            <button 
              onClick={handleNext} 
              disabled={isLoading || (step === 2 && (validationStatus.username === 'taken' || validationStatus.phone === 'taken' || validationStatus.name === 'taken'))} 
              className="bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black hover:bg-blue-600 transition-all flex items-center gap-3 shadow-2xl shadow-blue-900/20 active:scale-95 disabled:bg-slate-200"
            >
              {isLoading ? t('common.processing') : step === 5 ? t('auth.launchProfile') : t('common.continue')}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


  