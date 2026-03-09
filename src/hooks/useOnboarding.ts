'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { referralService } from '@/services/referralService';
import { userService } from '@/services/userService';
import { useOnboardingValidation } from './useOnboardingValidation';
import { UserRole } from '@/types';
import { useOnboardingLocation } from './useOnboardingLocation';
import { useOnboardingPersistence } from './useOnboardingPersistence';

/**
 * SIMPLIFIED ONBOARDING FLOW (6 STABLE STEPS)
 * 1. Referral (Optional)
 * 2. Identity (Basic Info)
 * 3. Security (OTP Verification)
 * 4. Your Base (Location)
 * 5. Platform Role (User Selection)
 * 6. Interests (Topic Selection) - Skipped for Hospitals
 */

export const useOnboarding = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  
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

  // Extract location-related state and fetching
  const { allCountries, allStates, allCities } = useOnboardingLocation(
    formData.countryIso, 
    formData.stateIso
  );

  // Extract progress resumption and auto-save/auto-sync logic
  const { initializing, saveProgressToFirestore } = useOnboardingPersistence(
    step,
    setStep,
    formData,
    setFormData,
    setFieldErrors
  );

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
        let isEmailOk = formData.emailVerified;
        let isPhoneOk = formData.phoneVerified;

        try {
          const syncResult = await userService.syncVerificationStatus();
          if (syncResult) {
            isEmailOk = syncResult.emailVerified;
            isPhoneOk = syncResult.phoneVerified;
            
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
