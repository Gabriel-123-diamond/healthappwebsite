import { useState, useEffect } from 'react';
import { referralService } from '@/services/referralService';
import { userService } from '@/services/userService';
import { APP_CONFIG } from '@/config/app_constants';

export const useOnboardingValidation = (formData: any) => {
  const [validationStatus, setValidationStatus] = useState({
    username: "idle" as "idle" | "checking" | "available" | "taken",
    phone: "idle" as "idle" | "checking" | "available" | "taken",
    name: "idle" as "idle" | "checking" | "available" | "taken",
    referral: "idle" as "idle" | "validating" | "valid" | "invalid",
    referralError: ""
  });

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
    }, APP_CONFIG.VALIDATION_DELAY);
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
    }, APP_CONFIG.VALIDATION_DELAY);
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
    }, APP_CONFIG.VALIDATION_DELAY);
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
    }, APP_CONFIG.VALIDATION_DELAY);
    return () => clearTimeout(tid);
  }, [formData.firstName, formData.lastName]);

  return { validationStatus, setValidationStatus };
};
