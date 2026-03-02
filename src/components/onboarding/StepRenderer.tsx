'use client';

import React from 'react';
import ReferralStep from './steps/ReferralStep';
import IdentityStep from './steps/IdentityStep';
import VerificationStep from './steps/VerificationStep';
import LocationStep from './steps/LocationStep';
import InterestsStep from './steps/InterestsStep';

interface StepRendererProps {
  step: number;
  formData: any;
  setFormData: (data: any) => void;
  validationStatus: {
    username: string;
    phone: string;
    name: string;
    licenseNumber: string;
    idNumber: string;
    referral: string;
    referralError: string;
  };
  countries: any[];
  allStates?: any[];
  allCities?: any[];
  roles: any[];
  toggleInterest: (interest: string) => void;
  t: (key: string) => string;
}

export default function StepRenderer({
  step,
  formData,
  setFormData,
  validationStatus,
  countries,
  allStates,
  allCities,
  roles,
  toggleInterest,
  t
}: StepRendererProps) {
  
  switch (step) {
    case 1:
      return (
        <ReferralStep 
          formData={formData} 
          setFormData={setFormData} 
          validationStatus={validationStatus} 
        />
      );
    case 2:
      return (
        <IdentityStep 
          formData={formData} 
          setFormData={setFormData} 
          validationStatus={validationStatus} 
          countries={countries} 
          states={allStates || []}
          cities={allCities || []}
        />
      );
    case 3:
      return (
        <VerificationStep 
          formData={formData} 
          setFormData={setFormData} 
        />
      );
    case 4:
      return (
        <LocationStep 
          formData={formData} 
          setFormData={setFormData} 
          countries={countries}
          allStates={allStates}
        />
      );
    case 5:
      return (
        <InterestsStep 
          formData={formData} 
          toggleInterest={toggleInterest} 
        />
      );
    default:
      return null;
  }
}
