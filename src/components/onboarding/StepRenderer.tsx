'use client';

import React from 'react';
import ReferralStep from './steps/ReferralStep';
import IdentityStep from './steps/IdentityStep';
import VerificationStep from './steps/VerificationStep';
import RoleStep from './steps/RoleStep';
import ExpertDetailsStep from './steps/ExpertDetailsStep';
import LocationStep from './steps/LocationStep';
import InterestsStep from './steps/InterestsStep';
import KYCStep from './steps/KYCStep';

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
  
  const isExpert = ['doctor', 'herbal_practitioner', 'hospital', 'expert'].includes(formData.role);

  switch (step) {
    case 1:
      return (
        isExpert ? (
          <KYCStep formData={formData} setFormData={setFormData} />
        ) : (
          <ReferralStep 
            formData={formData} 
            setFormData={setFormData} 
            validationStatus={validationStatus} 
          />
        )
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
        isExpert ? (
          <ExpertDetailsStep 
            formData={formData} 
            setFormData={setFormData}
            stepNumber={3}
          />
        ) : (
          <VerificationStep 
            formData={formData} 
            setFormData={setFormData} 
          />
        )
      );
    case 4:
      return (
        isExpert ? (
          <VerificationStep 
            formData={formData} 
            setFormData={setFormData} 
          />
        ) : (
          <RoleStep 
            formData={formData} 
            setFormData={setFormData} 
            roles={roles} 
          />
        )
      );
    case 5:
      return (
        isExpert ? (
          <LocationStep 
            formData={formData} 
            setFormData={setFormData} 
            countries={countries}
            allStates={allStates}
          />
        ) : (
          <ExpertDetailsStep 
            formData={formData} 
            setFormData={setFormData} 
          />
        )
      );
    case 6:
      return (
        isExpert ? (
          <InterestsStep 
            formData={formData} 
            toggleInterest={toggleInterest} 
          />
        ) : (
          <LocationStep 
            formData={formData} 
            setFormData={setFormData} 
            countries={countries}
            allStates={allStates}
          />
        )
      );
    case 7:
      return (
        isExpert ? null : (
          <InterestsStep 
            formData={formData} 
            toggleInterest={toggleInterest} 
          />
        )
      );
    default:
      return null;
  }
}
