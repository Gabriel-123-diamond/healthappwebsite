'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { userService } from '@/services/userService';
import { paymentService } from '@/services/paymentService';

export type UpgradeStep = 1 | 2 | 3;
export type TargetTier = string;

export function useExpertUpgrade() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<UpgradeStep>(1);
  const [targetTier, setTargetTier] = useState<TargetTier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const [formData, setFormData] = useState({
    licenseNumber: '',
    specialty: '',
    bio: '',
    experience: '1',
    identityUrl: '',
    licenseUrl: '',
    educationUrl: '',
    hospitalName: '',
    hospitalAddress: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/auth/signin');
      } else {
        setUser(currentUser);
        const profile = await userService.getUserProfile(currentUser.uid);
        if (profile) {
          setUserProfile(profile);
          setFormData(prev => ({
            ...prev,
            licenseNumber: profile.licenseNumber || '',
            specialty: profile.specialty || '',
            bio: profile.bio || '',
            experience: profile.yearsOfExperience || '1',
            hospitalName: profile.institutionName || '',
          }));

          if (profile.verificationStatus === 'pending') {
            setStep(3);
          }
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type
    });
  };

  const handleTierSelect = (tier: TargetTier) => {
    setTargetTier(tier);
    setStep(2);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTier || !user) return;

    setIsSubmitting(true);
    try {
      // 1. Process Payment First
      let amount = 35000;
      if (targetTier === 'professional') amount = 37500;
      else if (targetTier === 'authority') amount = 150000;
      else if (targetTier === 'vip1') amount = 22500;
      else if (targetTier === 'vip2') amount = 112500;
      else if (targetTier === 'hospital') amount = 150000;
      else if (targetTier === 'network') amount = 600000;
      
      const paymentResponse: any = await new Promise((resolve, reject) => {
        paymentService.initializePayment({
          email: user.email || '',
          amount: amount,
          metadata: {
            uid: user.uid,
            tier: targetTier,
            isExpert: true,
            type: 'expert_upgrade'
          },
          onSuccess: (response) => {
            console.log("Expert payment successful", response);
            resolve(response);
          },
          onClose: () => {
            reject(new Error("Payment cancelled"));
          }
        });
      });

      // 2. Submit Expert Profile with payment reference
      const expertProfile: any = {
        type: userProfile?.role,
        specialty: formData.specialty,
        yearsOfExperience: formData.experience,
        bio: formData.bio,
        tier: targetTier,
        verificationStatus: 'pending',
        paymentReference: paymentResponse.reference
      };

      if (userProfile?.role === 'hospital') {
        expertProfile.institutionName = formData.hospitalName;
        expertProfile.facilityAddress = formData.hospitalAddress;
      }

      await userService.submitExpertProfile({
        expertProfile,
        bio: formData.bio,
        specialties: [{ name: formData.specialty, years: formData.experience }],
        specialty: formData.specialty,
        yearsOfExperience: formData.experience,
        licenseNumber: formData.licenseNumber,
        tier: targetTier
      });
      
      setStep(3);
    } catch (error: any) {
      console.error(error);
      if (error.message !== "Payment cancelled") {
        showAlert('Upgrade Failed', 'Failed to initialize clinical verification', 'warning');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    userProfile,
    loading,
    step,
    setStep,
    targetTier,
    isSubmitting,
    formData,
    setFormData,
    modalConfig,
    setModalConfig,
    handleTierSelect,
    handleFormSubmit,
    showAlert
  };
}
