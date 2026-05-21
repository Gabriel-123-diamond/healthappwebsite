'use client';

import { referralService } from '@/services/referralService';
import { auth } from '@/lib/firebase';
import { OnboardingData, OnboardingValidationStatus } from '@/types/onboarding';

export const useOnboardingReferral = (
  formData: OnboardingData,
  setValidationStatus: React.Dispatch<React.SetStateAction<OnboardingValidationStatus>>,
  setFieldErrors: (errors: string[]) => void
) => {
  const handleStep1Referral = async () => {
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
          return false;
        }
      } catch (e: any) {
        if (e.message === "limit-reached") {
          setValidationStatus(prev => ({ ...prev, referral: "invalid", referralError: "Referral limit reached" }));
          setFieldErrors(["This referral code has already reached its usage limit."]);
        } else {
          setValidationStatus(prev => ({ ...prev, referral: "idle", referralError: "Error validating code" }));
          setFieldErrors(["Please check your network and try again."]);
        }
        return false;
      }
    }
    return true;
  };

  return { handleStep1Referral };
};
