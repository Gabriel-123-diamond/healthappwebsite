import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { referralService } from '@/services/referralService';
import { userService } from '@/services/userService';

export const useOnboarding = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [locationData, setLocationData] = useState<{lat: number, lng: number} | null>(null);
  
  const [validationStatus, setValidationStatus] = useState({
    username: "idle" as "idle" | "checking" | "available" | "taken",
    phone: "idle" as "idle" | "checking" | "available" | "taken",
    name: "idle" as "idle" | "checking" | "available" | "taken",
    referral: "idle" as "idle" | "validating" | "valid" | "invalid",
    referralError: ""
  });

  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    referralCode: "",
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
              phone: profile.phone?.replace(profile.country || '', '') || prev.phone,
              countryCode: profile.country || prev.countryCode, // Assuming country stores code for now or separate
              city: profile.city || prev.city,
              country: profile.country || prev.country,
              ageRange: profile.ageRange || prev.ageRange,
              role: profile.role || prev.role,
              interests: profile.interests || prev.interests,
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

  // Real-time Referral Code Check
  useEffect(() => {
    if (formData.referralCode.length < 3) {
      setValidationStatus(prev => ({ ...prev, referral: "idle", referralError: "" }));
      return;
    }
    
    setValidationStatus(prev => ({ ...prev, referral: "validating", referralError: "" }));
    const tid = setTimeout(async () => {
      try {
        const referrerUid = await referralService.validateReferralCode(formData.referralCode);
        if (referrerUid) {
          setValidationStatus(prev => ({ ...prev, referral: "valid", referralError: "" }));
        } else {
          setValidationStatus(prev => ({ ...prev, referral: "invalid", referralError: "Invalid referral code" }));
        }
      } catch (e) {
        setValidationStatus(prev => ({ ...prev, referral: "idle" }));
      }
    }, 800);
    return () => clearTimeout(tid);
  }, [formData.referralCode]);

  // Username Check
  useEffect(() => {
    if (formData.username.length < 3) {
      setValidationStatus(prev => ({ ...prev, username: "idle" }));
      return;
    }
    setValidationStatus(prev => ({ ...prev, username: "checking" }));
    const tid = setTimeout(async () => {
      try {
        const available = await userService.checkAvailability('username', formData.username);
        setValidationStatus(prev => ({ ...prev, username: available ? "available" : "taken" }));
      } catch (e) {
        setValidationStatus(prev => ({ ...prev, username: "idle" }));
      }
    }, 600);
    return () => clearTimeout(tid);
  }, [formData.username]);

  // Phone Check
  useEffect(() => {
    if (formData.phone.length < 5) {
      setValidationStatus(prev => ({ ...prev, phone: "idle" }));
      return;
    }
    setValidationStatus(prev => ({ ...prev, phone: "checking" }));
    const tid = setTimeout(async () => {
      try {
        const fullPhone = `${formData.countryCode}${formData.phone}`;
        const available = await userService.checkAvailability('phone', fullPhone);
        setValidationStatus(prev => ({ ...prev, phone: available ? "available" : "taken" }));
      } catch (e) {
        setValidationStatus(prev => ({ ...prev, phone: "idle" }));
      }
    }, 600);
    return () => clearTimeout(tid);
  }, [formData.phone, formData.countryCode]);

  // Name Check
  useEffect(() => {
    if (formData.firstName.length < 2 || formData.lastName.length < 2) {
      setValidationStatus(prev => ({ ...prev, name: "idle" }));
      return;
    }

    const letterOnlyRegex = /^[a-zA-Z\s-]+$/;
    if (!letterOnlyRegex.test(formData.firstName) || !letterOnlyRegex.test(formData.lastName)) {
      setValidationStatus(prev => ({ ...prev, name: "invalid" as any }));
      return;
    }

    setValidationStatus(prev => ({ ...prev, name: "checking" }));
    const tid = setTimeout(async () => {
      try {
        const fullName = `${formData.firstName} ${formData.lastName}`.toLowerCase();
        const available = await userService.checkAvailability('fullName', fullName);
        setValidationStatus(prev => ({ ...prev, name: available ? "available" : "taken" }));
      } catch (e) {
        setValidationStatus(prev => ({ ...prev, name: "idle" }));
      }
    }, 600);
    return () => clearTimeout(tid);
  }, [formData.firstName, formData.lastName]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationData({ lat: latitude, lng: longitude });
        
        try {
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          
          setFormData(prev => ({ 
            ...prev, 
            city: data.city || data.locality || data.principalSubdivision || '', 
            country: data.countryName || '' 
          }));
        } catch (error) {
          console.error("Reverse geocoding failed", error);
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
    setFieldErrors([]);
    
    if (step === 1) {
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
      if (!formData.ageRange) errors.push("Age range is required.");
      
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
      if (!formData.role) {
        setFieldErrors(["Please select a professional role."]);
        return;
      }
      await saveProgressToFirestore(4);
      setStep(4);
      return;
    }

    if (step === 4) {
      const errors = [];
      if (!formData.city) errors.push("City is required.");
      if (!formData.country) errors.push("Country is required.");
      
      if (errors.length > 0) {
        setFieldErrors(errors);
        return;
      }
      await saveProgressToFirestore(5);
      setStep(5);
      return;
    }

    if (step === 5) {
      if (formData.interests.length === 0) {
        setFieldErrors(["Please select at least one health interest."]);
        return;
      }
      
      setIsLoading(true);
      try {
        if (auth.currentUser) {
          const fullName = `${formData.firstName} ${formData.lastName}`.toLowerCase();
          
          await Promise.all([
            updateProfile(auth.currentUser, { displayName: `${formData.firstName} ${formData.lastName}` }),
            userService.updateUserProfile(auth.currentUser.uid, {
              firstName: formData.firstName,
              lastName: formData.lastName,
              fullName: fullName,
              email: auth.currentUser.email || '',
              username: formData.username.toLowerCase(),
              phone: `${formData.countryCode}${formData.phone}`,
              ageRange: formData.ageRange,
              role: formData.role,
              city: formData.city,
              country: formData.country,
              interests: formData.interests,
              onboardingComplete: true,
              onboardingStep: 5 // Final step
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
    }
  };

  const saveProgressToFirestore = async (nextStep: number) => {
    if (!auth.currentUser) return;
    try {
      await userService.updateUserProfile(auth.currentUser.uid, {
        ...formData,
        onboardingStep: nextStep,
        onboardingComplete: false
      });
    } catch (e) {
      console.error("Error saving progress:", e);
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
    locationData,
    validationStatus,
    fieldErrors,
    formData,
    setFormData,
    requestLocation,
    handleNext,
    toggleInterest
  };
};
