'use client';

import { useState, useEffect } from 'react';
import { referralService } from '@/services/referralService';
import { userService } from '@/services/userService';
import { APP_CONFIG } from '@/config/app_constants';

interface OnboardingFormData {
  referralCode: string;
  username: string;
  phone: string;
  countryCode: string;
  firstName: string;
  lastName: string;
  licenseNumber?: string;
  idNumber?: string;
}

export type ValidationState = "idle" | "checking" | "available" | "taken" | "invalid";
export type ReferralValidationState = "idle" | "validating" | "valid" | "invalid";

export const useOnboardingValidation = (formData: OnboardingFormData) => {
  const [validationStatus, setValidationStatus] = useState({
    username: "idle" as ValidationState,
    phone: "idle" as ValidationState,
    name: "idle" as ValidationState,
    licenseNumber: "idle" as ValidationState,
    idNumber: "idle" as ValidationState,
    referral: "idle" as ReferralValidationState,
    referralError: ""
  });

  // Real-time Referral Code Check
  useEffect(() => {
    const code = formData.referralCode;
    if (code.length < 3) {
      setValidationStatus(prev => 
        prev.referral === "idle" ? prev : { ...prev, referral: "idle", referralError: "" }
      );
      return;
    }
    
    setValidationStatus(prev => ({ ...prev, referral: "validating", referralError: "" }));
    const tid = setTimeout(async () => {
      try {
        const referrerUid = await referralService.validateReferralCode(code);
        setValidationStatus(prev => ({ 
          ...prev, 
          referral: referrerUid ? "valid" : "invalid", 
          referralError: referrerUid ? "" : "Invalid referral code" 
        }));
      } catch (_e) {
        setValidationStatus(prev => ({ ...prev, referral: "idle" }));
      }
    }, APP_CONFIG.VALIDATION_DELAY);
    return () => clearTimeout(tid);
  }, [formData.referralCode]);

  // Username Check
  useEffect(() => {
    const username = formData.username;
    if (username.length < 3) {
      setValidationStatus(prev => 
        prev.username === "idle" ? prev : { ...prev, username: "idle" }
      );
      return;
    }

    // Updated validation for username: Allow all symbols and characters (except maybe spaces if desired, but user said ALL symbols)
    // If you want to strictly allow everything including spaces:
    const usernameRegex = /^.+$/; 
    // If you want to allow everything except spaces (common for usernames):
    // const usernameRegex = /^\S+$/;
    
    if (!usernameRegex.test(username)) {
      setValidationStatus(prev => 
        prev.username === "invalid" ? prev : { ...prev, username: "invalid" }
      );
      return;
    }

    setValidationStatus(prev => ({ ...prev, username: "checking" }));
    const tid = setTimeout(async () => {
      try {
        const available = await userService.checkAvailability('username', username);
        setValidationStatus(prev => ({ ...prev, username: available ? "available" : "taken" }));
      } catch (_e) {
        setValidationStatus(prev => ({ ...prev, username: "idle" }));
      }
    }, APP_CONFIG.VALIDATION_DELAY);
    return () => clearTimeout(tid);
  }, [formData.username]);

  // Phone Check
  useEffect(() => {
    const digits = formData.phone.replace(/\D/g, '');
    if (digits.length < 7) {
      setValidationStatus(prev => 
        prev.phone === "idle" ? prev : { ...prev, phone: "idle" }
      );
      return;
    }
    setValidationStatus(prev => ({ ...prev, phone: "checking" }));
    const tid = setTimeout(async () => {
      try {
        const fullPhone = `${formData.countryCode}${digits}`;
        const available = await userService.checkAvailability('phone', fullPhone);
        setValidationStatus(prev => ({ ...prev, phone: available ? "available" : "taken" }));
      } catch (_e) {
        setValidationStatus(prev => ({ ...prev, phone: "idle" }));
      }
    }, APP_CONFIG.VALIDATION_DELAY);
    return () => clearTimeout(tid);
  }, [formData.phone, formData.countryCode]);

  // Name Check
  useEffect(() => {
    const { firstName, lastName } = formData;
    if (firstName.length < 2 || lastName.length < 2) {
      setValidationStatus(prev => 
        prev.name === "idle" ? prev : { ...prev, name: "idle" }
      );
      return;
    }

    const nameRegex = /^[a-zA-Z-]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setValidationStatus(prev => 
        prev.name === "invalid" ? prev : { ...prev, name: "invalid" }
      );
      return;
    }

    setValidationStatus(prev => ({ ...prev, name: "checking" }));
    const tid = setTimeout(async () => {
      try {
        const fullName = `${firstName} ${lastName}`.toLowerCase();
        const available = await userService.checkAvailability('fullName', fullName);
        setValidationStatus(prev => ({ ...prev, name: available ? "available" : "taken" }));
      } catch (_e) {
        setValidationStatus(prev => ({ ...prev, name: "idle" }));
      }
    }, APP_CONFIG.VALIDATION_DELAY);
    return () => clearTimeout(tid);
  }, [formData.firstName, formData.lastName]);

  // License Number Check
  useEffect(() => {
    const license = formData.licenseNumber;
    if (!license || license.length < 5) {
      setValidationStatus(prev => 
        prev.licenseNumber === "idle" ? prev : { ...prev, licenseNumber: "idle" }
      );
      return;
    }
    setValidationStatus(prev => ({ ...prev, licenseNumber: "checking" }));
    const tid = setTimeout(async () => {
      try {
        const available = await userService.checkAvailability('licenseNumber', license);
        setValidationStatus(prev => ({ ...prev, licenseNumber: available ? "available" : "taken" }));
      } catch (_e) {
        setValidationStatus(prev => ({ ...prev, licenseNumber: "idle" }));
      }
    }, APP_CONFIG.VALIDATION_DELAY);
    return () => clearTimeout(tid);
  }, [formData.licenseNumber]);

  // ID Number Check
  useEffect(() => {
    const idNum = formData.idNumber;
    if (!idNum || idNum.length < 5) {
      setValidationStatus(prev => 
        prev.idNumber === "idle" ? prev : { ...prev, idNumber: "idle" }
      );
      return;
    }
    setValidationStatus(prev => ({ ...prev, idNumber: "checking" }));
    const tid = setTimeout(async () => {
      try {
        const available = await userService.checkAvailability('idNumber', idNum.trim());
        setValidationStatus(prev => ({ ...prev, idNumber: available ? "available" : "taken" }));
      } catch (_e) {
        setValidationStatus(prev => ({ ...prev, idNumber: "idle" }));
      }
    }, APP_CONFIG.VALIDATION_DELAY);
    return () => clearTimeout(tid);
  }, [formData.idNumber]);

  return { validationStatus, setValidationStatus };
};
