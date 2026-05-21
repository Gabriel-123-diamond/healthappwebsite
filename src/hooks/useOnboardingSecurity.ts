'use client';

import { auth } from '@/lib/firebase';
import { userService } from '@/services/userService';
import { OnboardingData } from '@/types/onboarding';

export const useOnboardingSecurity = (
  formData: OnboardingData,
  setFormData: React.Dispatch<React.SetStateAction<OnboardingData>>,
  setIsLoading: (loading: boolean) => void,
  setFieldErrors: (errors: string[]) => void
) => {
  const handleStep3Security = async () => {
    setIsLoading(true);
    setFieldErrors([]);

    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
      }
      
      const syncResult = await userService.syncVerificationStatus();
      
      if (!syncResult) {
        setFieldErrors(["Unable to verify status. Please check your connection."]);
        return false;
      }

      if (!syncResult.emailVerified) {
        setFieldErrors(["Your email is NOT verified in our protocol. Even if using Google, you must verify to proceed."]);
        return false;
      }

      if (formData.role !== 'user' && !syncResult.phoneVerified) {
        setFieldErrors(["Phone verification is required for experts and hospitals."]);
        return false;
      }
      
      setFormData(prev => ({
        ...prev,
        emailVerified: true,
        phoneVerified: syncResult.phoneVerified
      }));

      return true;
    } catch (e) {
      console.error("Security sync error:", e);
      setFieldErrors(["Verification failed. Please ensure you've entered the correct code."]);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshVerification = async () => {
    setIsLoading(true);
    setFieldErrors([]);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
      }
      
      const syncResult = await userService.syncVerificationStatus();
      if (syncResult) {
        setFormData(prev => ({
          ...prev,
          emailVerified: syncResult.emailVerified,
          phoneVerified: syncResult.phoneVerified
        }));
        
        if (syncResult.emailVerified && (formData.role === 'user' || syncResult.phoneVerified)) {
          return true;
        }
      }
      return false;
    } catch (e) {
      setFieldErrors(["Failed to sync verification status. Please try again."]);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleStep3Security, refreshVerification };
};
