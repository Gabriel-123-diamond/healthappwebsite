'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { userService } from '@/services/userService';
import { APP_CONFIG } from '@/config/app_constants';

export const useOnboardingPersistence = (
  step: number,
  setStep: (step: number) => void,
  formData: any,
  setFormData: (fn: (prev: any) => any) => void,
  setFieldErrors: (fn: (prev: string[]) => string[]) => void
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [initializing, setInitializing] = useState(true);

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
  }, [router, searchParams, setStep, setFormData]);

  // Handle URL and localStorage referral code
  useEffect(() => {
    const urlRef = searchParams.get('ref') || searchParams.get('referral');
    const storedRef = localStorage.getItem('pending_referral_code');
    
    const finalRef = urlRef || storedRef;
    
    if (finalRef) {
      setFormData(prev => ({ ...prev, referralCode: finalRef.toUpperCase() }));
      // Clear it once used
      localStorage.removeItem('pending_referral_code');
    }
  }, [searchParams, setFormData]);

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
  }, [step, initializing, setFormData, setFieldErrors]);

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
          ...safeData 
        } = formData as any;
        
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

  return {
    initializing,
    saveProgressToFirestore
  };
};
