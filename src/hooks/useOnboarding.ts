import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { referralService } from '@/services/referralService';
import { userService } from '@/services/userService';
import { useOnboardingValidation } from './useOnboardingValidation';
import { isExpertRole, UserRole } from '@/types';
import { APP_CONFIG } from '@/config/app_constants';

import { locationService } from '@/services/locationService';

/**
 * ONBOARDING FLOW (7 STABLE STEPS)
 * 1. Start (Referral or KYC)
 * 2. Identity (Basic Info)
 * 3. Security (OTP Verification)
 * 4. Platform Role (Selection)
 * 5. Credentials (Expert Details - Skipped for 'user' role)
 * 6. Your Base (Location)
 * 7. Interests (Topic Selection)
 */

export const useOnboarding = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  
  // Lists for dynamic dropdowns
  const [allCountries, setAllCountries] = useState<any[]>([]);
  const [allStates, setAllStates] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);

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
    role: (searchParams.get('role') || "user") as UserRole,
    interests: [] as string[],
    // Expert-specific fields
    specialty: "",
    customSpecialty: "",
    licenseNumber: "",
    institutionName: "",
    emailVerified: false,
    phoneVerified: false,
    kycDocument: "",
    kycDocType: "National ID"
  });

  const { validationStatus, setValidationStatus } = useOnboardingValidation(formData);

  const isExpert = isExpertRole(formData.role);

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
              setStep(profile.onboardingStep);
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
              role: profile.role || prev.role,
              interests: profile.interests || prev.interests,
              specialty: profile.specialty || prev.specialty,
              licenseNumber: profile.licenseNumber || prev.licenseNumber,
              institutionName: profile.institutionName || prev.institutionName,
              emailVerified: profile.emailVerified || false,
              phoneVerified: profile.phoneVerified || false,
              kycDocument: profile.kycDocument || prev.kycDocument,
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

  // Handle URL referral code
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode.toUpperCase() }));
    }
  }, [searchParams]);

  // Immediate save for critical milestones (like verification)
  useEffect(() => {
    if (initializing || !auth.currentUser) return;
    
    const saveCriticalMilestone = async () => {
      try {
        await userService.updateProfile(auth.currentUser!.uid, {
          emailVerified: formData.emailVerified,
          phoneVerified: formData.phoneVerified,
          onboardingStep: step,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.error("Critical save failed:", e);
      }
    };

    if (formData.emailVerified || formData.phoneVerified) {
      saveCriticalMilestone();
    }
  }, [formData.emailVerified, formData.phoneVerified, step, initializing]);

  // Debounced Progress Saving
  useEffect(() => {
    if (initializing || !auth.currentUser) return;

    const timer = setTimeout(async () => {
      try {
        await userService.updateProfile(auth.currentUser!.uid, {
          ...formData,
          onboardingStep: step,
          onboardingComplete: false,
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
      // Step 1: Start (Referral / KYC)
      if (step === 1) {
        if (isExpert) {
          if (!formData.kycDocument) {
            setFieldErrors(["Identity verification (KYC) is mandatory for medical professionals."]);
            setIsLoading(false);
            return;
          }
        } else if (formData.referralCode.trim() !== "") {
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
        if (isExpert && !formData.dateOfBirth) errors.push("Date of birth is required.");
        if (!isExpert && !formData.ageRange) errors.push("Age range is required.");
        
        if (validationStatus.username === 'taken') errors.push("Username is already taken.");
        if (validationStatus.phone === 'taken') errors.push("Phone number is already taken.");
        if (validationStatus.name === 'taken') errors.push("This name is already registered.");

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
        const errors = [];
        if (!formData.emailVerified) errors.push("Please verify your email address.");
        if (!formData.phoneVerified) errors.push("Please verify your phone number.");
        
        if (errors.length > 0) {
          setFieldErrors(errors);
          setIsLoading(false);
          return;
        }

        // Skip Role selection (4) if already coming from an expert link
        if (isExpert && searchParams.get('role')) {
          await saveAndGoTo(5);
        } else {
          await saveAndGoTo(4);
        }
        return;
      }

      // Step 4: Platform Role
      if (step === 4) {
        if (!formData.role) {
          setFieldErrors(["Please select your professional role."]);
          setIsLoading(false);
          return;
        }
        
        // If user role, skip credentials (step 5)
        if (formData.role === 'user') {
          await saveAndGoTo(6);
        } else {
          await saveAndGoTo(5);
        }
        return;
      }

      // Step 5: Credentials (Expert Only)
      if (step === 5) {
        const errors = [];
        if (!formData.specialty) errors.push("Primary specialty is required.");
        if (formData.role === 'hospital' && !formData.institutionName) errors.push("Institution name is required.");
        if (!formData.licenseNumber) errors.push(formData.role === 'hospital' ? "Registration / License ID is required." : "Professional license number is required.");
        
        if (errors.length > 0) {
          setFieldErrors(errors);
          setIsLoading(false);
          return;
        }
        await saveAndGoTo(6);
        return;
      }

      // Step 6: Location
      if (step === 6) {
        const errors = [];
        if (!formData.city) errors.push("City is required.");
        if (!formData.state) errors.push("State/Province is required.");
        if (!formData.country) errors.push("Country is required.");
        
        if (errors.length > 0) {
          setFieldErrors(errors);
          setIsLoading(false);
          return;
        }

        if (formData.role === 'hospital') {
          await completeOnboarding();
        } else {
          await saveAndGoTo(7);
        }
        return;
      }

      // Step 7: Interests
      if (step === 7) {
        if (formData.interests.length === 0) {
          setFieldErrors(["Please select at least one health interest."]);
          setIsLoading(false);
          return;
        }
        await completeOnboarding();
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
        const fullName = `${formData.firstName} ${formData.lastName}`.toLowerCase();
        const finalSpecialty = formData.specialty === 'Other' ? formData.customSpecialty : formData.specialty;
        
        await Promise.all([
          updateProfile(auth.currentUser, { displayName: `${formData.firstName} ${formData.lastName}` }),
          userService.updateProfile(auth.currentUser.uid, {
            ...formData,
            specialty: finalSpecialty,
            fullName: fullName,
            email: auth.currentUser.email || '',
            username: formData.username.toLowerCase(),
            phone: `${formData.countryCode}${formData.phone.replace(/\s/g, '')}`,
            onboardingComplete: true,
            onboardingStep: step,
            profileComplete: !isExpert
          }),
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
      await userService.updateProfile(auth.currentUser.uid, {
        ...formData,
        onboardingStep: targetStep,
        onboardingComplete: false
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
      } else if (step === 6 && formData.role === 'user') {
        await saveAndGoTo(4); // Skip Expert Details (5) when going back
      } else if (step === 5 && isExpert && searchParams.get('role')) {
        await saveAndGoTo(3); // Skip Role selection (4) when going back if already assigned
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
