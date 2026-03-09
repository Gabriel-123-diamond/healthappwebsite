'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { userService } from '@/services/userService';
import { useExpertForm } from './expert-setup/useExpertForm';

export const useExpertSetup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const router = useRouter();

  const {
    formData,
    setFormData,
    validationErrors,
    validateStep,
    handleUpdate,
  } = useExpertForm();

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const profile = await userService.getUserProfile(user.uid);
          setUserProfile(profile);
          
          if (profile?.expertProfile) {
            const ep = profile.expertProfile as any;
            
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
  }, [router, setFormData]);

  const saveProgress = async (nextStep?: number) => {
    if (!validateStep(step)) return;

    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const now = new Date().toISOString();
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
          specialty: formData.specialties[0]?.name || '',
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
