'use client';

import React from 'react';
import ReferralStep from './steps/ReferralStep';
import IdentityStep from './steps/IdentityStep';
import RoleStep from './steps/RoleStep';
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
    referral: string;
    referralError: string;
  };
  countries: any[];
  roles: any[];
  locationData: any;
  requestLocation: () => void;
  toggleInterest: (interest: string) => void;
  t: (key: string) => string;
}

export default function StepRenderer({
  step,
  formData,
  setFormData,
  validationStatus,
  countries,
  roles,
  locationData,
  requestLocation,
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
          t={t} 
        />
      );
    case 3:
      return (
        <RoleStep 
          formData={formData} 
          setFormData={setFormData} 
          roles={roles} 
        />
      );
    case 4:
      return (
        <LocationStep 
          formData={formData} 
          setFormData={setFormData} 
          locationData={locationData} 
          requestLocation={requestLocation} 
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
