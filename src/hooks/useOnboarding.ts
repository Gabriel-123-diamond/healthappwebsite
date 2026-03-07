'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { referralService } from '@/services/referralService';
import { userService } from '@/services/userService';
import { useOnboardingValidation } from './useOnboardingValidation';
import { UserRole } from '@/types';
import { APP_CONFIG } from '@/config/app_constants';

import { locationService } from '@/services/locationService';

/**
 * SIMPLIFIED ONBOARDING FLOW (6 STABLE STEPS)
 * 1. Referral (Optional)
 * 2. Identity (Basic Info)
 * 3. Security (OTP Verification)
 * 4. Your Base (Location)
 * 5. Platform Role (User Selection)
 * 6. Interests (Topic Selection) - Skipped for Hospitals
 */

interface LocationItem {
  id: number;
  name: string;
  iso2: string;
  emoji?: string;
}

export const useOnboarding = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  
  // Lists for dynamic dropdowns
  const [allCountries, setAllCountries] = useState<LocationItem[]>([]);
  const [allStates, setAllStates] = useState<LocationItem[]>([]);
  const [allCities, setAllCities] = useState<LocationItem[]>([]);

  const [formData, setFormData] = useState({
    referralCode: "",
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    countryCode: "+234",
    city: "",
    state: "",
    country: "",
    countryIso: "",
    stateIso: "",
    ageRange: "",
    dateOfBirth: "",
    role: "user" as UserRole, // Initial onboarding is always 'user'
    tier: "basic" as 'basic' | 'professional' | 'standard' | 'premium',
    interests: [] as string[],
    emailVerified: false,
    phoneVerified: false,
    kyc: {
      idNumber: '',
      idCardUrl: '',
      selfieUrl: '',
      passportPhotoUrl: '',
      dob: '',
      address: '',
    },
  });

  const { validationStatus, setValidationStatus } = useOnboardingValidation(formData);

  // Fetch initial countries
  useEffect(() => {
    locationService.getCountries().then(setAllCountries).catch(console.error);
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (formData.countryIso) {
      locationService.getStates(formData.countryIso).then(setAllStates).catch(console.error);
    } else {
      setAllStates([]);
    }
    setAllCities([]);
  }, [formData.countryIso]);

  // Fetch cities when state changes
  useEffect(() => {
    if (formData.countryIso && formData.stateIso) {
      locationService.getCities(formData.countryIso, formData.stateIso).then(setAllCities).catch(console.error);
    } else {
      setAllCities([]);
    }
  }, [formData.countryIso, formData.stateIso]);

  // Resume Progress Logic
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        const refCode = searchParams.get('ref');
        const signupUrl = refCode ? `/auth/signup?ref=${refCode}&returnTo=onboarding` : '/auth/signup?returnTo=onboarding';
        router.push(signupUrl);
      } else {
        try {
          const profile = await userService.getUserProfile(user.uid);
          if (profile) {
            if (profile.onboardingComplete) {
              router.push('/');
              return;
            }
            
            if (profile.onboardingStep) {
              // Ensure we don't go beyond our new 6 steps
              setStep(Math.min(profile.onboardingStep, 6));
            }

            setFormData(prev => ({
              ...prev,
              firstName: profile.firstName || prev.firstName,
              lastName: profile.lastName || prev.lastName,
              username: profile.username || prev.username,
              phone: profile.phone?.replace(profile.countryCode || '', '') || prev.phone,
              countryCode: profile.countryCode || prev.countryCode, 
              city: profile.city || prev.city,
              state: profile.state || prev.state,
              country: profile.country || prev.country,
              countryIso: profile.countryIso || prev.countryIso,
              stateIso: profile.stateIso || prev.stateIso,
              ageRange: profile.ageRange || prev.ageRange,
              dateOfBirth: profile.dateOfBirth || prev.dateOfBirth,
              interests: profile.interests || prev.interests,
              emailVerified: profile.emailVerified || false,
              phoneVerified: profile.phoneVerified || false,
              role: profile.role || prev.role,
              tier: profile.tier || prev.tier,
              kyc: {
                ...prev.kyc,
                ...(profile as any).kyc
              }
            }));
          }
          setInitializing(false);
        } catch (e) {
          console.error("Error resuming onboarding:", e);
          setInitializing(false);
        }
      }
    });
    return () => unsubscribe();
  }, [router, searchParams]);

  // Handle URL and localStorage referral code
  useEffect(() => {
    const urlRef = searchParams.get('ref') || searchParams.get('referral');
    const storedRef = localStorage.getItem('pending_referral_code');
    
    const finalRef = urlRef || storedRef;
    
    if (finalRef) {
      setFormData(prev => ({ ...prev, referralCode: finalRef.toUpperCase() }));
      // Clear it once used so it doesn't persist to other accounts on same machine
      localStorage.removeItem('pending_referral_code');
    }
  }, [searchParams]);

  // Auto-sync verification status when on Step 3
  useEffect(() => {
    if (initializing || !auth.currentUser || step !== 3) return;

    const sync = async () => {
      try {
        const result = await userService.syncVerificationStatus();
        if (result) {
          setFormData(prev => {
            const isEmailNewlyVerified = result.emailVerified && !prev.emailVerified;
            const isPhoneNewlyVerified = result.phoneVerified && !prev.phoneVerified;
            
            if (isEmailNewlyVerified || isPhoneNewlyVerified) {
              // Clear relevant errors if we just verified something
              setFieldErrors(current => current.filter(err => 
                !(result.emailVerified && err.includes("email")) && 
                !(result.phoneVerified && err.includes("phone"))
              ));
            }

            return {
              ...prev,
              emailVerified: result.emailVerified,
              phoneVerified: result.phoneVerified
            };
          });
        }
      } catch (e) {
        console.error("Auto-sync verification failed:", e);
      }
    };

    sync();
    const interval = setInterval(sync, 4000); // Slightly faster sync
    return () => clearInterval(interval);
  }, [step, initializing]);

  // Debounced Progress Saving
  useEffect(() => {
    if (initializing || !auth.currentUser) return;

    const timer = setTimeout(async () => {
      try {
        // STRICT: Exclude ALL platform-managed fields from the client-side auto-save
        const { 
          role: _role, 
          tier: _tier, 
          emailVerified: _ev, 
          phoneVerified: _pv, 
          // points is not in formData, but if it was added later
          ...safeData 
        } = formData as any;
        
        // Remove other fields that might be in safeData but shouldn't be updated directly
        const finalData = { ...safeData };
        delete (finalData as any).points;
        delete (finalData as any).verificationStatus;
        delete (finalData as any).onboardingComplete;

        await userService.updateProfile(auth.currentUser!.uid, {
          ...finalData,
          onboardingStep: step,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.error("Auto-save failed:", e);
      }
    }, APP_CONFIG.AUTO_SAVE_DELAY);

    return () => clearTimeout(timer);
  }, [formData, step, initializing]);

  const handleNext = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setFieldErrors([]);
    
    try {
      // Step 1: Referral
      if (step === 1) {
        if (formData.referralCode.trim() !== "") {
          setValidationStatus(prev => ({ ...prev, referral: "validating", referralError: "" }));
          try {
            const referrerUid = await referralService.validateReferralCode(formData.referralCode);
            if (referrerUid) {
              setValidationStatus(prev => ({ ...prev, referral: "valid" }));
              if (auth.currentUser) {
                await referralService.applyReferralCode(formData.referralCode, referrerUid, auth.currentUser.uid, auth.currentUser.email);
              }
            } else {
              setValidationStatus(prev => ({ ...prev, referral: "invalid", referralError: "Invalid referral code" }));
              setFieldErrors(["Please enter a valid referral code or leave it blank."]);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            setValidationStatus(prev => ({ ...prev, referral: "idle", referralError: "Error validating code" }));
            setIsLoading(false);
            return;
          }
        }
        await saveAndGoTo(2);
        return;
      }

      // Step 2: Identity
      if (step === 2) {
        const errors = [];
        if (!formData.firstName) errors.push("First name is required.");
        if (!formData.lastName) errors.push("Last name is required.");
        if (!formData.username) errors.push("Username is required.");
        if (!formData.phone) errors.push("Phone number is required.");
        if (!formData.ageRange) errors.push("Age range is required.");
        
        if (validationStatus.username === 'taken') errors.push("Username is already taken.");
        if (validationStatus.phone === 'taken') errors.push("Phone number is already taken.");
        if (validationStatus.name === 'taken') errors.push("This name is already registered.");
        if (validationStatus.name === 'invalid') errors.push("Names can only contain letters and hyphens (-).");

        if (errors.length > 0) {
          setFieldErrors(errors);
          setIsLoading(false);
          return;
        }
        await saveAndGoTo(3);
        return;
      }

      // Step 3: Security Check (Verification)
      if (step === 3) {
        // Use the absolute latest status from the server for the final check
        let isEmailOk = formData.emailVerified;
        let isPhoneOk = formData.phoneVerified;

        try {
          const syncResult = await userService.syncVerificationStatus();
          if (syncResult) {
            isEmailOk = syncResult.emailVerified;
            isPhoneOk = syncResult.phoneVerified;
            
            // Update state too so UI matches
            setFormData(prev => ({
              ...prev,
              emailVerified: isEmailOk,
              phoneVerified: isPhoneOk
            }));
          }
        } catch (e) {
          console.warn("Final sync attempt failed", e);
        }

        const errors = [];
        if (!isEmailOk) errors.push("Please verify your email address.");
        if (!isPhoneOk) errors.push("Please verify your phone number.");
        
        if (errors.length > 0) {
          setFieldErrors(errors);
          setIsLoading(false);
          return;
        }

        await saveAndGoTo(4);
        return;
      }

      // Step 4: Your Base (Location)
      if (step === 4) {
        const errors = [];
        if (!formData.city) errors.push("City is required.");
        if (!formData.state) errors.push("State/Province is required.");
        if (!formData.country) errors.push("Country is required.");
        
        if (errors.length > 0) {
          setFieldErrors(errors);
          setIsLoading(false);
          return;
        }

        await saveAndGoTo(5);
        return;
      }

      // Step 5: Platform Role
      if (step === 5) {
        if (!formData.role) {
          setFieldErrors(["Please select your platform role."]);
          setIsLoading(false);
          return;
        }

        if (formData.role === 'hospital') {
          // Hospitals skip interests and complete onboarding
          await completeOnboarding();
        } else {
          await saveAndGoTo(6);
        }
        return;
      }

      // Step 6: Interests
      if (step === 6) {
        if (formData.interests.length === 0) {
          setFieldErrors(["Please select at least one health interest."]);
          setIsLoading(false);
          return;
        }
        
        await completeOnboarding();
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveAndGoTo = async (nextStep: number) => {
    await saveProgressToFirestore(nextStep);
    setStep(nextStep);
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      if (auth.currentUser) {
        await Promise.all([
          updateProfile(auth.currentUser, { displayName: `${formData.firstName} ${formData.lastName}` }),
          userService.completeOnboarding(formData),
          referralService.completeReferral(auth.currentUser.uid)
        ]);

        localStorage.removeItem('onboarding_data');
        router.push('/');
      }
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgressToFirestore = async (targetStep: number) => {
    if (!auth.currentUser) return;
    try {
      const { 
        role: _role, 
        tier: _tier, 
        emailVerified: _ev, 
        phoneVerified: _pv, 
        ...safeData 
      } = formData as any;

      const finalData = { ...safeData };
      delete (finalData as any).points;
      delete (finalData as any).verificationStatus;
      delete (finalData as any).onboardingComplete;

      await userService.updateProfile(auth.currentUser.uid, {
        ...finalData,
        onboardingStep: targetStep
      });
    } catch (e) {
      console.error("Error saving progress:", e);
    }
  };

  const handleBack = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (step === 1) {
        router.push('/auth/signup');
      } else {
        await saveAndGoTo(step - 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(topic) ? prev.interests.filter(i => i !== topic) : [...prev.interests, topic]
    }));
  };

  return {
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
  };
};
