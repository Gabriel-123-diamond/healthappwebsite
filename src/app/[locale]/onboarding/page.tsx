'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, UserCircle, Stethoscope, Leaf, Building2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import OnboardingSidebar from '@/components/onboarding/OnboardingSidebar';
import StepRenderer from '@/components/onboarding/StepRenderer';
import { useTranslations } from 'next-intl';
import { countries } from '@/lib/countries';

export default function OnboardingPage() {
  const router = useRouter();
  const t = useTranslations();
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
    const tid = setTimeout(async () => {
      try {
        const res = await fetch('/api/user/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field: 'username', value: formData.username })
        });
        const data = await res.json();
        setUsernameStatus(data.taken ? "taken" : "available");
      } catch (e) {
        setUsernameStatus("idle");
      }
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
    const tid = setTimeout(async () => {
      try {
        const fullPhone = `${formData.countryCode}${formData.phone}`;
        const res = await fetch('/api/user/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field: 'phone', value: fullPhone })
        });
        const data = await res.json();
        setPhoneStatus(data.taken ? "taken" : "available");
      } catch (e) {
        setPhoneStatus("idle");
      }
    }, 600);
    return () => clearTimeout(tid);
  }, [formData.phone, formData.countryCode]);

  // Name Check
  useEffect(() => {
    if (formData.firstName.length < 2 || formData.lastName.length < 2) {
      setNameStatus("idle");
      return;
    }
    setNameStatus("checking");
    const tid = setTimeout(async () => {
      try {
        const fullName = `${formData.firstName} ${formData.lastName}`.toLowerCase();
        const res = await fetch('/api/user/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field: 'fullName', value: fullName })
        });
        const data = await res.json();
        setNameStatus(data.taken ? "taken" : "available");
      } catch (e) {
        setNameStatus("idle");
      }
    }, 600);
    return () => clearTimeout(tid);
  }, [formData.firstName, formData.lastName]);

  // Load saved state
  useEffect(() => {
    const savedData = localStorage.getItem('onboarding_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData);
        setStep(parsed.step);
      } catch (e) {
        console.error("Error parsing saved onboarding data", e);
      }
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
    
    // We can auto-trigger or ask for confirmation. 
    // Since it's a dedicated step, let's just trigger it.

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationData({ lat: latitude, lng: longitude });
        
        try {
          // Using BigDataCloud's free client-side reverse geocoding API
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          
          setFormData(prev => ({ 
            ...prev, 
            city: data.city || data.locality || data.principalSubdivision || '', 
            country: data.countryName || '' 
          }));
        } catch (error) {
          console.error("Reverse geocoding failed", error);
          // Fallback to coordinates if geocoding fails
          setFormData(prev => ({ 
            ...prev, 
            city: `Lat: ${latitude.toFixed(2)}`, 
            country: `Long: ${longitude.toFixed(2)}` 
          }));
        }
      },
      (error) => {
        console.error(error);
        alert("Permission denied or location unavailable. Please enter manually.");
      }
    );
  };

  const handleNext = async () => {
    if (step === 1) {
      if (usernameStatus !== 'available' || phoneStatus !== 'available' || nameStatus !== 'available') return;
      if (!formData.firstName || !formData.lastName || !formData.username || !formData.phone || !formData.ageRange) return;
    }

    if (step === 2 && !formData.role) return;
    if (step === 3 && (!formData.city || !formData.country)) return;

    if (step < 4) {
      const nextStep = step + 1;
      setStep(nextStep);
    } else {
      setIsLoading(true);
      try {
        if (auth.currentUser) {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const fullName = `${formData.firstName} ${formData.lastName}`.toLowerCase();
          
          await Promise.all([
            updateProfile(auth.currentUser, { displayName: `${formData.firstName} ${formData.lastName}` }),
            setDoc(userRef, {
              firstName: formData.firstName,
              lastName: formData.lastName,
              fullName: fullName,
              username: formData.username.toLowerCase(),
              phone: `${formData.countryCode}${formData.phone}`,
              ageRange: formData.ageRange,
              role: formData.role,
              city: formData.city,
              country: formData.country,
              interests: formData.interests,
              onboardingComplete: true,
              updatedAt: serverTimestamp(),
            }, { merge: true })
          ]);

          // Clear saved onboarding data
          localStorage.removeItem('onboarding_data');
          router.push('/');
        }
      } catch (err) {
        console.error("Failed to complete onboarding:", err);
      } finally {
        setIsLoading(false);
      }
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
                t={t}
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
              {step === 1 ? t('auth.backToSignUp') : t('common.previous')}
            </button>
            <button 
              onClick={handleNext} 
              disabled={isLoading || (step === 1 && (usernameStatus === 'taken' || phoneStatus === 'taken' || nameStatus === 'taken'))} 
              className="bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black hover:bg-blue-600 transition-all flex items-center gap-3 shadow-2xl shadow-blue-900/20 active:scale-95 disabled:bg-slate-200"
            >
              {isLoading ? t('common.processing') : step === 4 ? t('auth.launchProfile') : t('common.continue')}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}