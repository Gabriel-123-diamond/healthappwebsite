import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { userService } from '@/services/userService';
import { PhoneEntry } from '@/components/expert/ExpertPhoneManager';

export const useExpertSetup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    bio: '',
    specialties: [] as { name: string, years: string }[],
    phones: [] as PhoneEntry[],
    languages: [] as string[],
    expertType: 'doctor' as 'doctor' | 'herbal_practitioner' | 'hospital',
    education: [{ degree: '', institution: '', year: '', certUrl: '' }],
    kyc: {
      idCardUrl: '',
      selfieUrl: '',
      passportPhotoUrl: '',
      dob: '',
      address: '',
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
    yearsOfExperience: '', // Keep for aggregate/compatibility
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const profile = await userService.getUserProfile(user.uid);
          setUserProfile(profile);
          
          if (profile?.expertProfile) {
            const ep = profile.expertProfile as any;
            
            // Migrate legacy specialties data if needed
            let migratedSpecialties: { name: string, years: string }[] = [];
            if (Array.isArray(ep.specialties)) {
              migratedSpecialties = ep.specialties.map((s: any) => 
                typeof s === 'string' ? { name: s, years: ep.yearsOfExperience || '0' } : s
              );
            } else if (ep.specialty) {
              migratedSpecialties = [{ name: ep.specialty, years: ep.yearsOfExperience || '0' }];
            }

            setFormData({
              bio: ep.bio || '',
              specialties: migratedSpecialties,
              phones: ep.phones || (profile.phone ? [{ number: profile.phone.replace(profile.countryCode || '', ''), code: profile.countryCode || '+234', label: 'Primary' }] : []),
              languages: ep.languages || [],
              expertType: ep.type || (profile.role === 'hospital' ? 'hospital' : 'doctor'),
              education: ep.education || [{ degree: '', institution: '', year: '', certUrl: '' }],
              kyc: ep.kyc || formData.kyc,
              license: ep.license || formData.license,
              practice: ep.practice || formData.practice,
              profile: ep.profile || { expertise: ep.expertise || [], consultationFee: ep.consultationFee || '', availability: ep.availability || '' },
              legal: ep.legal || formData.legal,
              yearsOfExperience: ep.yearsOfExperience || '',
            });
          } else if (profile?.phone) {
             setFormData(prev => ({
               ...prev,
               specialties: profile.specialties && profile.specialties.length > 0 
                 ? profile.specialties 
                 : (profile.specialty ? [{ name: profile.specialty, years: profile.yearsOfExperience || '0' }] : []),
               phones: [{ number: profile.phone.replace(profile.countryCode || '', ''), code: profile.countryCode || '+234', label: 'Primary' }],
               yearsOfExperience: profile.yearsOfExperience || '',
             }));
          }
        } catch (err) {
          console.error("Error loading profile:", err);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/auth/signin');
      }
    };
    loadProfile();
  }, [router]);

  const validateStep = useCallback((stepNumber: number) => {
    const errors: Record<string, string> = {};
    
    if (stepNumber === 1) {
      if (formData.specialties.length === 0) {
        errors.specialties = "At least one specialty is required.";
      } else if (formData.specialties.some(s => !s.years || parseInt(s.years) <= 0)) {
        errors.specialties = "Specify years of experience (at least 1) for all specialties.";
      }
      if (formData.phones.length === 0 || !formData.phones[0].number) errors.phones = "Primary phone is required.";
    }
    
    if (stepNumber === 2) {
      if (!formData.kyc.idCardUrl) errors.idCard = "ID Card is required.";
      if (!formData.kyc.selfieUrl) errors.selfie = "Selfie is required.";
      if (!formData.kyc.dob) errors.dob = "Date of birth is required.";
      if (!formData.kyc.address) errors.address = "Address is required.";
    }

    if (stepNumber === 3) {
      if (!formData.license.licenseNumber) errors.licenseNumber = "License number is required.";
      if (!formData.license.licenseCertUrl) errors.licenseCert = "License certificate is required.";
      if (!formData.license.annualLicenseUrl) errors.annualLicense = "Current annual license is required.";
    }

    if (stepNumber === 4) {
      formData.education.forEach((edu, i) => {
        if (!edu.degree || !edu.institution || !edu.year) errors[`edu-${i}`] = "Complete all fields.";
      });
    }

    if (stepNumber === 5) {
      if (!formData.practice.hospitalName) errors.hospitalName = "Clinic/Hospital name is required.";
      if (!formData.practice.yearsExperience) errors.yearsExperience = "Experience is required.";
    }

    if (stepNumber === 6) {
      if (formData.bio.length < 50) errors.bio = "Bio must be at least 50 characters.";
      if (formData.profile.expertise.length === 0) errors.expertise = "List at least one area of expertise.";
      if (formData.languages.length === 0) errors.languages = "Select at least one language.";
    }

    if (stepNumber === 7) {
      if (!formData.legal.tosAccepted || !formData.legal.privacyAccepted || !formData.legal.telemedicineAccepted || !formData.legal.conductAccepted) {
        errors.agreements = "All policies must be accepted.";
      }
      if (!formData.legal.signature) errors.signature = "Digital signature is required.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const saveProgress = async (nextStep?: number) => {
    if (!validateStep(step)) return;

    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const now = new Date().toISOString();
        // Calculate total years as the maximum from any single specialty
        const maxYears = formData.specialties.reduce((max, s) => Math.max(max, parseInt(s.years) || 0), 0).toString();

        const expertUpdate: any = {
          id: user.uid,
          uid: user.uid,
          name: userProfile?.fullName || user.displayName || '',
          email: user.email || '',
          phoneNumber: formData.phones[0]?.number.replace(/\s/g, ''),
          phones: formData.phones.map(p => ({ ...p, number: p.number.replace(/\s/g, '') })),
          type: formData.expertType,
          specialties: formData.specialties,
          specialty: formData.specialties[0]?.name || '', // Primary for compatibility
          yearsOfExperience: maxYears,
          verificationStatus: nextStep === undefined ? 'pending' : (userProfile?.verificationStatus || 'unverified'),
          country: userProfile?.country || '',
          state: userProfile?.state || '',
          kyc: formData.kyc,
          license: formData.license,
          education: formData.education,
          practice: formData.practice,
          bio: formData.bio,
          expertise: formData.profile.expertise,
          consultationFee: formData.profile.consultationFee,
          availability: formData.profile.availability,
          languages: formData.languages,
          legal: {
            ...formData.legal,
            timestamp: now,
          },
          updatedAt: now,
        };

        if (nextStep === undefined) {
          await userService.submitExpertProfile({
            expertProfile: expertUpdate,
            bio: formData.bio,
            specialties: formData.specialties,
            specialty: formData.specialties[0]?.name || '',
            yearsOfExperience: maxYears,
            licenseNumber: formData.license.licenseNumber
          });
          router.push('/expert/dashboard');
        } else {
          await userService.updateProfile(user.uid, {
            expertProfile: expertUpdate,
            bio: formData.bio,
            specialties: formData.specialties,
            specialty: formData.specialties[0]?.name || '',
            yearsOfExperience: maxYears,
            licenseNumber: formData.license.licenseNumber,
            // verificationStatus stays the same as current
          });
          setStep(nextStep);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = async () => {
    if (!auth.currentUser) return;
    
    setIsReverting(true);
    try {
      await userService.resetOnboarding(auth.currentUser.uid);
      router.push('/onboarding');
    } catch (error) {
      console.error("Failed to revert onboarding:", error);
      setError("Failed to reset onboarding. Please try again.");
    } finally {
      setIsReverting(false);
    }
  };

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

  const addItem = (field: 'education') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], { degree: '', institution: '', year: '', certUrl: '' }] }));
  };

  const removeItem = (field: 'education', index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const updateArrayItem = (field: 'education', index: number, key: string, value: string) => {
    const newArray = [...formData[field]];
    (newArray[index] as any)[key] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  return {
    step,
    setStep,
    totalSteps: 7,
    loading,
    saving,
    isReverting,
    error,
    formData,
    userProfile,
    validationErrors,
    handleUpdate,
    saveProgress,
    handleRevert,
    addItem,
    removeItem,
    updateArrayItem
  };
};
