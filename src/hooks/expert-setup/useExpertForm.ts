import { useState, useCallback } from 'react';
import { PhoneEntry } from '@/types';

export const useExpertForm = () => {
  const [formData, setFormData] = useState({
    bio: '',
    specialties: [] as { name: string, years: string }[],
    phones: [] as PhoneEntry[],
    languages: [] as string[],
    expertType: 'doctor' as 'doctor' | 'wellness_practitioner' | 'hospital',
    education: [{ degree: '', institution: '', year: '', certUrl: '' }],
    kyc: {
      idCardUrl: '',
      selfieUrl: '',
      passportPhotoUrl: '',
      dob: '',
      address: '',
      idNumber: '',
    },
    license: {
      licenseNumber: '',
      issuanceYear: '',
      expiryDate: '',
      practicingStatus: 'active',
      licenseCertUrl: '',
      annualLicenseUrl: '',
    },
    practice: {
      hospitalName: '',
      hospitalAddress: '',
      yearsExperience: '',
      consultationType: 'both' as 'both' | 'physical' | 'telemedicine',
      hospitalIdUrl: '',
    },
    profile: {
      expertise: [] as string[],
      consultationFee: '',
      availability: '',
    },
    legal: {
      tosAccepted: false,
      privacyAccepted: false,
      telemedicineAccepted: false,
      conductAccepted: false,
      signature: '',
    },
    yearsOfExperience: '',
    tier: 'basic' as 'basic' | 'vip1' | 'vip2' | 'professional' | 'standard' | 'premium',
    verificationLevel: 1, // Progresses as they complete steps
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateStep = useCallback((stepNumber: number) => {
    const errors: Record<string, string> = {};
    
    if (stepNumber === 1) {
      if (!(formData as any).tier) errors.tier = "Please select an authority level.";
    }

    if (stepNumber === 2) {
      if (!formData.kyc.idCardUrl) errors.idCard = "ID Card is required.";
      if (!formData.kyc.selfieUrl) errors.selfie = "Selfie is required.";
      if (!formData.kyc.idNumber) errors.idNumber = "ID Number is required.";
    }
    
    if (stepNumber === 3) {
      if (!formData.kyc.dob) errors.dob = "Date of birth is required.";
      if (!formData.kyc.address) errors.address = "Address is required.";
      if (formData.specialties.length === 0) {
        errors.specialties = "At least one specialty is required.";
      } else if (formData.specialties.some(s => !s.years || parseInt(s.years) < 0)) {
        errors.specialties = "Specify years of experience for all specialties.";
      }
      if (formData.phones.length === 0 || !formData.phones[0].number) errors.phones = "Primary phone is required.";
    }

    if (stepNumber === 4) {
      if (!formData.license.licenseNumber) errors.licenseNumber = "License number is required.";
      if (!formData.license.licenseCertUrl && !formData.license.annualLicenseUrl && !(formData.license as any).licenseUrl) {
        errors.licenseCert = "License document is required.";
      }
    }

    if (stepNumber === 5) {
      formData.education.forEach((edu, i) => {
        if (!edu.degree || !edu.institution || !edu.year) errors[`edu-${i}`] = "Complete all fields.";
      });
    }

    if (stepNumber === 6) {
      if (!formData.practice.hospitalName) errors.hospitalName = "Clinic/Hospital name is required.";
      if (!formData.practice.yearsExperience) errors.yearsExperience = "Experience is required.";
    }

    if (stepNumber === 7) {
      if (formData.bio.length < 50) errors.bio = "Bio must be at least 50 characters.";
      if (formData.profile.expertise.length === 0) errors.expertise = "List at least one area of expertise.";
      if (formData.languages.length === 0) errors.languages = "Select at least one language.";
      if (formData.expertType === 'doctor' && (!formData.profile.consultationFee || parseFloat(formData.profile.consultationFee) <= 0)) {
        errors.consultationFee = "Doctors must set a consultation fee.";
      }
    }

    if (stepNumber === 8) {
      if (!formData.legal.tosAccepted || !formData.legal.privacyAccepted || !formData.legal.telemedicineAccepted || !formData.legal.conductAccepted) {
        errors.agreements = "All policies must be accepted.";
      }
      if (!formData.legal.signature) errors.signature = "Digital signature is required.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleUpdate = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return {
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    validateStep,
    handleUpdate,
  };
};
