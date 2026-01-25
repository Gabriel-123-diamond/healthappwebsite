'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, UserCircle, Stethoscope, Leaf, Building2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import OnboardingSidebar from '@/components/onboarding/OnboardingSidebar';
import StepRenderer from '@/components/onboarding/StepRenderer';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [locationData, setLocationData] = useState<{lat: number, lng: number} | null>(null);
  
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [phoneStatus, setPhoneStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [nameStatus, setNameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    countryCode: "+234",
    city: "",
    country: "",
    ageRange: "",
    role: "user",
    interests: [] as string[]
  });

  const steps = [
    { number: 1, title: "Identity" },
    { number: 2, title: "Professional Role" },
    { number: 3, title: "Location" },
    { number: 4, title: "Interests" }
  ];

  const roles = [
    { id: "user", label: "General User", icon: UserCircle, desc: "I am looking for health information." },
    { id: "doctor", label: "Doctor", icon: Stethoscope, desc: "I am a verified medical professional." },
    { id: "herbalist", label: "Herbalist", icon: Leaf, desc: "I am a traditional medicine practitioner." },
    { id: "hospital", label: "Hospital", icon: Building2, desc: "I represent a healthcare facility." },
  ];

  const countries = [
    { name: 'Nigeria', code: '+234' }, { name: 'Ghana', code: '+233' },
    { name: 'Senegal', code: '+221' }, { name: 'USA', code: '+1' },
    { name: 'UK', code: '+44' }, { name: 'Australia', code: '+61' }
  ];

  // Auth Protection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to home if not logged in (user request)
        router.push('/');
      } else {
        setInitializing(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Username Check
  useEffect(() => {
    if (formData.username.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    const tid = setTimeout(() => {
      setUsernameStatus(formData.username.toLowerCase() === 'admin' ? "taken" : "available");
    }, 600);
    return () => clearTimeout(tid);
  }, [formData.username]);

  // Phone Check
  useEffect(() => {
    if (formData.phone.length < 5) {
      setPhoneStatus("idle");
      return;
    }
    setPhoneStatus("checking");
    const tid = setTimeout(() => {
      setPhoneStatus(formData.phone === '1234567890' ? "taken" : "available");
    }, 600);
    return () => clearTimeout(tid);
  }, [formData.phone]);

  // Name Check
  useEffect(() => {
    if (formData.firstName.length < 2 || formData.lastName.length < 2) {
      setNameStatus("idle");
      return;
    }
    setNameStatus("checking");
    const tid = setTimeout(() => {
      const fullName = `${formData.firstName} ${formData.lastName}`.toLowerCase();
      setNameStatus(fullName === 'john doe' ? "taken" : "available");
    }, 600);
    return () => clearTimeout(tid);
  }, [formData.firstName, formData.lastName]);

  // Load saved state
  useEffect(() => {
    const savedData = localStorage.getItem('onboarding_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed.formData);
      setStep(parsed.step);
    }
  }, []);

  // Save state on change
  useEffect(() => {
    localStorage.setItem('onboarding_data', JSON.stringify({ formData, step }));
  }, [formData, step]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    // Show user feedback that we are requesting
    const confirmLocation = confirm("We would like to access your location to find nearby experts. Allow?");
    if (!confirmLocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
// ...

  const handleNext = async () => {
    if (step === 1) {
      if (usernameStatus === 'taken' || phoneStatus === 'taken' || nameStatus === 'taken') return;
    }

    if (step < 4) setStep(step + 1);
    else {
      setIsLoading(true);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: `${formData.firstName} ${formData.lastName}` });
        await new Promise(r => setTimeout(r, 1000));
        router.push('/');
      }
      setIsLoading(false);
    }
  };

  if (initializing) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-5xl w-full bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[750px]">
        <OnboardingSidebar currentStep={step} steps={steps} />
        
        <div className="p-10 md:p-20 md:w-2/3 flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <StepRenderer 
                step={step}
                formData={formData}
                setFormData={setFormData}
                usernameStatus={usernameStatus}
                phoneStatus={phoneStatus}
                nameStatus={nameStatus}
                countries={countries}
                roles={roles}
                locationData={locationData}
                requestLocation={requestLocation}
                toggleInterest={(topic) => setFormData(prev => ({
                  ...prev,
                  interests: prev.interests.includes(topic) ? prev.interests.filter(i => i !== topic) : [...prev.interests, topic]
                }))}
              />
            </AnimatePresence>
          </div>

          <div className="mt-16 flex justify-between items-center">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : router.push('/auth/signup')} 
              className="text-slate-400 font-bold hover:text-slate-900 transition-colors px-6 py-2 rounded-xl hover:bg-slate-50"
            >
              {step === 1 ? 'Back to Sign Up' : 'Previous'}
            </button>
            <button 
              onClick={handleNext} 
              disabled={isLoading || (step === 1 && (usernameStatus === 'taken' || phoneStatus === 'taken' || nameStatus === 'taken'))} 
              className="bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black hover:bg-blue-600 transition-all flex items-center gap-3 shadow-2xl shadow-blue-900/20 active:scale-95 disabled:bg-slate-200"
            >
              {isLoading ? 'Processing...' : step === 4 ? 'Launch Profile' : 'Continue'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
