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
    // Expert-specific fields for onboarding
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
            
            // Resume from saved step if it exists
            if (profile.onboardingStep) {
              setStep(profile.onboardingStep);
            }

            // Populate form with existing data
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
              ageRange: profile.ageRange || prev.ageRange,
              role: profile.role || prev.role,
              interests: profile.interests || prev.interests,
              specialty: profile.specialty || prev.specialty,
              licenseNumber: profile.licenseNumber || prev.licenseNumber,
              institutionName: profile.institutionName || prev.institutionName,
              emailVerified: profile.emailVerified || false,
              phoneVerified: profile.phoneVerified || false,
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
    }, APP_CONFIG.AUTO_SAVE_DELAY); // Save after delay

    return () => clearTimeout(timer);
  }, [formData, step, initializing]);

  const handleNext = async () => {
    setFieldErrors([]);
    
    if (step === 1) {
      if (isExpert) {
        if (!formData.kycDocument) {
          setFieldErrors(["Identity verification (KYC) is mandatory for medical professionals."]);
          return;
        }
        await saveProgressToFirestore(2);
        setStep(2);
        return;
      }
      
      if (formData.referralCode.trim() === "") {
        await saveProgressToFirestore(2);
        setStep(2);
        return;
      }
      setValidationStatus(prev => ({ ...prev, referral: "validating", referralError: "" }));
      try {
        const referrerUid = await referralService.validateReferralCode(formData.referralCode);
        if (referrerUid) {
          setValidationStatus(prev => ({ ...prev, referral: "valid" }));
          if (auth.currentUser) {
            await referralService.applyReferralCode(
              formData.referralCode, 
              referrerUid, 
              auth.currentUser.uid, 
              auth.currentUser.email
            );
          }
          await saveProgressToFirestore(2);
          setStep(2);
        } else {
          setValidationStatus(prev => ({ ...prev, referral: "invalid", referralError: "Invalid referral code" }));
          setFieldErrors(["Please enter a valid referral code or leave it blank."]);
        }
      } catch (e) {
        setValidationStatus(prev => ({ ...prev, referral: "idle", referralError: "Error validating code" }));
      }
      return;
    }

    if (step === 2) {
      const errors = [];
      if (!formData.firstName) errors.push("First name is required.");
      if (!formData.lastName) errors.push("Last name is required.");
      if (!formData.username) errors.push("Username is required.");
      if (!formData.phone) errors.push("Phone number is required.");
      if (isExpert && !formData.dateOfBirth) errors.push("Date of birth is required for verification.");
      if (!isExpert && !formData.ageRange) errors.push("Age range is required.");
      
      if (validationStatus.username === 'taken') errors.push("Username is already taken.");
      if (validationStatus.phone === 'taken') errors.push("Phone number is already associated with an account.");
      if (validationStatus.name === 'taken') errors.push("This name combination is unavailable.");
      if (validationStatus.name === 'invalid' as any) errors.push("Names must contain only letters.");

      if (errors.length > 0) {
        setFieldErrors(errors);
        return;
      }
      await saveProgressToFirestore(3);
      setStep(3);
      return;
    }

    if (step === 3) {
      if (isExpert) {
        const errors = [];
        if (!formData.licenseNumber) errors.push("Professional license number is required.");
        if (!formData.specialty) errors.push("Primary specialty is required.");
        
        if (errors.length > 0) {
          setFieldErrors(errors);
          return;
        }
        await saveProgressToFirestore(4);
        setStep(4);
        return;
      }
      
      const errors = [];
      if (!formData.emailVerified) errors.push("Please verify your email address.");
      if (!formData.phoneVerified) errors.push("Please verify your phone number.");
      
      if (errors.length > 0) {
        setFieldErrors(errors);
        return;
      }
      await saveProgressToFirestore(4);
      setStep(4);
      return;
    }

    if (step === 4) {
      if (isExpert) {
        // Step 4 for Expert is OTP Verification
        const errors = [];
        if (!formData.emailVerified) errors.push("Please verify your email address.");
        if (!formData.phoneVerified) errors.push("Please verify your phone number.");
        
        if (errors.length > 0) {
          setFieldErrors(errors);
          return;
        }
        await saveProgressToFirestore(5);
        setStep(5);
        return;
      }

      if (!formData.role) {
        setFieldErrors(["Please select a professional role."]);
        return;
      }
      
      await saveProgressToFirestore(5);
      setStep(5);
      return;
    }

    if (step === 5) {
      if (isExpert) {
        // Step 5 for Expert is Location
        const errors = [];
        if (!formData.city) errors.push("City is required.");
        if (!formData.state) errors.push("State/Province is required.");
        if (!formData.country) errors.push("Country is required.");
        
        if (errors.length > 0) {
          setFieldErrors(errors);
          return;
        }
        await saveProgressToFirestore(6);
        setStep(6);
        return;
      }

      // Non-expert Step 5 is Expert Details (only if they chose expert role late)
      const errors = [];
      if (!formData.specialty) errors.push("Specialty is required.");
      if (formData.role !== 'hospital' && !formData.licenseNumber) errors.push("License number is required.");
      if (formData.role === 'hospital' && !formData.institutionName) errors.push("Institution name is required.");
      
      if (errors.length > 0) {
        setFieldErrors(errors);
        return;
      }
      await saveProgressToFirestore(6);
      setStep(6);
      return;
    }

    if (step === 6) {
      if (isExpert) {
        // Step 6 for Expert is Interests
        if (formData.interests.length === 0) {
          setFieldErrors(["Please select at least one health interest."]);
          return;
        }
        await completeOnboarding();
        return;
      }

      const errors = [];
      if (!formData.city) errors.push("City is required.");
      if (!formData.state) errors.push("State/Province is required.");
      if (!formData.country) errors.push("Country is required.");
      
      if (errors.length > 0) {
        setFieldErrors(errors);
        return;
      }
      await saveProgressToFirestore(7);
      setStep(7);
      return;
    }

    if (step === 7) {
      if (formData.interests.length === 0) {
        setFieldErrors(["Please select at least one health interest."]);
        return;
      }
      await completeOnboarding();
    }
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
            onboardingStep: isExpert ? 6 : 7,
            profileComplete: isExpert ? false : true 
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

  const saveProgressToFirestore = async (nextStep: number) => {
    if (!auth.currentUser) return;
    try {
      await userService.updateProfile(auth.currentUser.uid, {
        ...formData,
        onboardingStep: nextStep,
        onboardingComplete: false
      });
    } catch (e) {
      console.error("Error saving progress:", e);
    }
  };

  const handleBack = async () => {
    if (step === 1) {
      router.push('/auth/signup');
    } else {
      let prevStep = step - 1;
      // Branching back logic can be complex, but for now linear is fine
      await saveProgressToFirestore(prevStep);
      setStep(prevStep);
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
