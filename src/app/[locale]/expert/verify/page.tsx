'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { verificationService } from '@/services/verificationService';
import { userService } from '@/services/userService';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslations } from 'next-intl';
import { 
  VerificationSuccessState, VerificationHeader, PhoneVerificationSection, DocumentUploadSection 
} from '@/components/expert/VerificationComponents';

export default function VerificationPage() {
  const tOnboarding = useTranslations('onboarding.security');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<'license' | 'id' | 'certificate' | 'other'>('license');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [userData, setUserData] = useState<any>(null);
  const [phoneStatus, setPhoneStatus] = useState<'idle' | 'sending' | 'sent' | 'verified'>('idle');
  const [phoneOtp, setPhoneOtp] = useState('');

  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const loadUser = async () => {
      if (auth.currentUser) {
        const profile = await userService.getUserProfile(auth.currentUser.uid);
        setUserData(profile);
        if (profile?.phoneVerified) {
          setPhoneStatus('verified');
        }
      }
    };
    loadUser();
  }, []);

  const sendPhoneOtp = async () => {
    setPhoneStatus('sending');
    setError('');
    // For demo purposes, we simulate sending.
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPhoneStatus('sent');
  };

  const verifyPhoneOtp = async () => {
    if (phoneOtp === '123456') {
      setPhoneStatus('sending');
      try {
        const fullPhone = userData?.phone || '';
        const result = await userService.verifyPhone(fullPhone);
        
        if (result?.phoneVerified) {
          setPhoneStatus('verified');
          setUserData((prev: any) => ({ ...prev, phoneVerified: true }));
        } else {
          setError('Phone verification failed on server.');
          setPhoneStatus('sent');
        }
      } catch (e) {
        setError('Connection error during phone verification.');
        setPhoneStatus('sent');
      }
    } else {
      setError('Invalid PIN. Use the sandbox key (123456) provided below.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB.');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneStatus !== 'verified') {
      setError('Please verify your phone number first.');
      return;
    }
    if (!file) {
      setError('Please upload a supporting document.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (user) {
        // 1. Upload the document
        const documentUrl = await verificationService.uploadDocument(user.uid, file, documentType);
        
        // 2. Submit the application
        await verificationService.submitApplication(
          user.uid,
          licenseNumber,
          documentUrl,
          documentType
        );

        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setError('User session not found. Please login again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <VerificationSuccessState />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 sm:pt-40 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-[32px] shadow-xl p-8 sm:p-12 border border-slate-100 dark:border-slate-700">
        <VerificationHeader />

        <div className="space-y-10">
          <PhoneVerificationSection
            userData={userData}
            phoneStatus={phoneStatus}
            phoneOtp={phoneOtp}
            setPhoneOtp={setPhoneOtp}
            onSend={sendPhoneOtp}
            onVerify={verifyPhoneOtp}
            onReset={() => {
              setPhoneStatus('idle');
              setPhoneOtp('');
            }}
            t={tOnboarding}
          />

          <div className="h-px bg-slate-100 dark:bg-slate-700 w-full" />

          <DocumentUploadSection
            licenseNumber={licenseNumber}
            setLicenseNumber={setLicenseNumber}
            documentType={documentType}
            setDocumentType={setDocumentType}
            file={file}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
            phoneStatus={phoneStatus}
          />
        </div>
      </div>
    </div>
  );
}
