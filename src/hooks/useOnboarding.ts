'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { referralService } from '@/services/referralService';
import { userService } from '@/services/userService';
import { useOnboardingValidation } from './useOnboardingValidation';
import { useOnboardingLocation } from './useOnboardingLocation';
import { useOnboardingPersistence } from './useOnboardingPersistence';
import { useOnboardingReferral } from './useOnboardingReferral';
import { useOnboardingSecurity } from './useOnboardingSecurity';
import { initialOnboardingData, OnboardingData } from '@/types/onboarding';

export const useOnboarding = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<OnboardingData>(initialOnboardingData);

  const { validationStatus, setValidationStatus } = useOnboardingValidation(formData);

  const { allCountries, allStates, allCities } = useOnboardingLocation(
    formData.countryIso, 
    formData.stateIso
  );

  const { initializing, saveProgressToFirestore } = useOnboardingPersistence(
    step, setStep, formData, setFormData, setFieldErrors
  );

  const { handleStep1Referral } = useOnboardingReferral(
    formData, setValidationStatus, setFieldErrors
  );

  const { handleStep3Security, refreshVerification } = useOnboardingSecurity(
    formData, setFormData, setIsLoading, setFieldErrors
  );

  const handleStep2Identity = () => {
    const errors = [];
    
    if (formData.role === 'hospital') {
      if (!formData.facilityName) errors.push("Facility name is required.");
      if (!formData.facilityType) errors.push("Facility type is required.");
      if (!formData.registrationNumber) errors.push("Registration/License number is required.");
      if (!formData.firstName) errors.push("Administrator name is required.");
      if (!formData.phone) errors.push("Official phone number is required.");
    } else {
      if (!formData.firstName) errors.push("First name is required.");
      if (!formData.lastName) errors.push("Last name is required.");
      if (!formData.username) errors.push("Username is required.");
      if (!formData.phone) errors.push("Phone number is required.");
      if (!formData.ageRange) errors.push("Age range is required.");

      if (formData.role === 'doctor' || formData.role === 'wellness_practitioner') {
        if (!formData.licenseNumber) errors.push("License number is required.");
        if (!formData.issuingBoard) errors.push("Issuing board is required.");
        if (!formData.graduationYear) errors.push("Graduation year is required.");
      }
      
      if (validationStatus.username === 'taken') errors.push("Username is already taken.");
      if (validationStatus.phone === 'taken') errors.push("Phone number is already taken.");
      if (validationStatus.name === 'taken') errors.push("This name is already registered.");
      if (validationStatus.name === 'invalid') errors.push("Names can only contain letters and hyphens (-).");
    }

    if (errors.length > 0) {
      setFieldErrors(errors);
      return false;
    }
    return true;
  };

  const handleStep4Location = () => {
    const errors = [];
    if (!formData.city) errors.push("City is required.");
    if (!formData.state) errors.push("State/Province is required.");
    if (!formData.country) errors.push("Country is required.");
    
    if (formData.role === 'hospital') {
      if (!formData.address) errors.push("Street address is required.");
      if (!formData.postalCode) errors.push("Postal code is required.");
    }
    
    if (errors.length > 0) {
      setFieldErrors(errors);
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setFieldErrors([]);
    
    try {
      if (step === 1) {
        if (await handleStep1Referral()) await saveAndGoTo(2);
      } else if (step === 2) {
        if (!formData.role) {
          setFieldErrors(["Please select your platform role."]);
        } else {
          await saveAndGoTo(3);
        }
      } else if (step === 3) {
        if (handleStep2Identity()) await saveAndGoTo(4);
      } else if (step === 4) {
        if (handleStep4Location()) await saveAndGoTo(5);
      } else if (step === 5) {
        if (await handleStep3Security()) {
          if (formData.role === 'hospital') {
            await completeOnboarding();
          } else {
            await saveAndGoTo(6);
          }
        }
      } else if (step === 6) {
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
        await Promise.all([
          updateProfile(auth.currentUser, { displayName: `${formData.firstName} ${formData.lastName}` }),
          userService.completeOnboarding(formData),
          referralService.completeReferral(auth.currentUser.uid)
        ]);
        localStorage.removeItem('onboarding_data');
        if (formData.role === 'hospital') {
          router.push('/hospital/dashboard');
        } else if (formData.role === 'user') {
          router.push('/');
        } else {
          router.push('/expert/dashboard');
        }
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

  const reloadCurrentStep = async () => {
    setIsLoading(true);
    try {
      if (auth.currentUser) {
        const profile = await userService.getUserProfile(auth.currentUser.uid);
        if (profile) {
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
          }));
        }
      }
    } catch (e) {
      console.error("Failed to reload step data:", e);
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

  const toggleChronicCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      chronicConditions: prev.chronicConditions.includes(condition) ? prev.chronicConditions.filter(i => i !== condition) : [...prev.chronicConditions, condition]
    }));
  };

  const toggleFamilyHistory = (history: string) => {
    setFormData(prev => ({
      ...prev,
      familyHistory: prev.familyHistory.includes(history) ? prev.familyHistory.filter(i => i !== history) : [...prev.familyHistory, history]
    }));
  };

  const toggleLifestyleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      lifestyleGoals: prev.lifestyleGoals.includes(goal) ? prev.lifestyleGoals.filter(i => i !== goal) : [...prev.lifestyleGoals, goal]
    }));
  };

  return {
    step, setStep, isLoading, initializing, validationStatus, fieldErrors, formData, setFormData,
    handleNext, handleBack, refreshVerification, reloadCurrentStep, toggleInterest,
    toggleChronicCondition, toggleFamilyHistory, toggleLifestyleGoal,
    allCountries, allStates, allCities
  };
};
