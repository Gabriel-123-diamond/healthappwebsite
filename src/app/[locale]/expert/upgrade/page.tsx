'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { userService } from '@/services/userService';
import { 
  ShieldCheck, 
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { UserRole } from '@/types';
import NiceModal from '@/components/common/NiceModal';

// Modular Components
import { ExpertRoleStep } from '@/components/expert/upgrade/ExpertRoleStep';
import { ExpertApplicationForm } from '@/components/expert/upgrade/ExpertApplicationForm';
import { ExpertPendingReview } from '@/components/expert/upgrade/ExpertPendingReview';
import { ExpertTierSelection } from '@/components/expert/upgrade/ExpertTierSelection';

export default function ExpertUpgradePage() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsLoading] = useState(false);
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

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type
    });
  };

  const [formData, setFormData] = useState({
    role: 'doctor' as UserRole,
    specialty: '',
    licenseNumber: '',
    institutionName: '',
    facilityAddress: '',
    facilityType: 'Clinic',
    bio: '',
    experience: '1',
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
            role: (profile.role as UserRole) || 'doctor',
            specialty: profile.specialty || '',
            licenseNumber: profile.licenseNumber || '',
            institutionName: profile.institutionName || '',
            bio: profile.bio || '',
            experience: profile.yearsOfExperience || '1',
          }));

          if (profile.verificationStatus === 'pending') {
            setStep(3);
          } else if (profile.verificationStatus === 'verified') {
            setStep(4);
          }
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setIsLoading(true);
      try {
        const expertProfile: any = {
          type: formData.role,
          specialty: formData.specialty,
          yearsOfExperience: formData.experience,
          bio: formData.bio,
        };

        if (formData.role === 'hospital') {
          expertProfile.facilityAddress = formData.facilityAddress;
          expertProfile.facilityType = formData.facilityType;
          expertProfile.institutionName = formData.institutionName;
        }

        await userService.submitExpertProfile({
          expertProfile,
          bio: formData.bio,
          specialties: [{ name: formData.specialty, years: formData.experience }],
          specialty: formData.specialty,
          yearsOfExperience: formData.experience,
          licenseNumber: formData.licenseNumber
        });
        
        setStep(3);
      } catch (error) {
        console.error(error);
        showAlert('Submission Failed', 'Failed to submit application', 'warning');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpgradeTier = async (newTier: 'basic' | 'professional' | 'standard' | 'premium') => {
    setIsLoading(true);
    try {
      await userService.upgradeTier(newTier);
      showAlert('Upgrade Successful', `Successfully upgraded to ${newTier.toUpperCase()}!`, 'success');
      setTimeout(() => router.push('/expert/dashboard'), 2000);
    } catch (error) {
      showAlert('Upgrade Failed', 'Failed to upgrade tier', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-20 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-12">
          <button 
            onClick={() => step === 1 ? router.push('/profile') : setStep(step - 1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:white transition-colors uppercase font-black text-[10px] tracking-widest mb-8"
          >
            <ChevronLeft size={14} />
            {step === 1 ? 'Back to Profile' : 'Previous Step'}
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20 text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Professional Upgrade</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {step <= 2 ? `Step ${step} of 2: Application` : step === 3 ? 'Review Phase' : 'Subscription Tier'}
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <ExpertRoleStep 
              formData={formData} 
              setFormData={setFormData} 
              onNext={handleNext} 
            />
          )}

          {step === 2 && (
            <ExpertApplicationForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleNext} 
              isSubmitting={isSubmitting} 
            />
          )}

          {step === 3 && (
            <ExpertPendingReview 
              onReturn={() => router.push('/profile')} 
            />
          )}

          {step === 4 && (
            <ExpertTierSelection 
              onUpgrade={handleUpgradeTier} 
              isSubmitting={isSubmitting} 
            />
          )}
        </AnimatePresence>

        <NiceModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          title={modalConfig.title}
          description={modalConfig.description}
          type={modalConfig.type}
        />
      </div>
    </div>
  );
}
