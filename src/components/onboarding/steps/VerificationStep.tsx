'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, AlertCircle, Fingerprint } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useTranslations } from 'next-intl';
import { VerificationCard } from '../VerificationCard';
import { SandboxProtocol } from '../SandboxProtocol';

interface VerificationStepProps {
  formData: any;
  setFormData: (data: any | ((prev: any) => any)) => void;
}

export default function VerificationStep({ formData, setFormData }: VerificationStepProps) {
  const t = useTranslations('onboarding.security');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'verified'>(
    formData.emailVerified ? 'verified' : 'idle'
  );
  const [phoneStatus, setPhoneStatus] = useState<'idle' | 'sending' | 'sent' | 'verified'>(
    formData.phoneVerified ? 'verified' : 'idle'
  );
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [error, setError] = useState('');

  const userEmail = auth.currentUser?.email || 'user@example.com';

  const sendEmailOtp = async () => {
    setEmailStatus('sending');
    setError('');
    // For demo purposes, we simulate sending.
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEmailStatus('sent');
  };

  const verifyEmailOtp = async () => {
    if (emailOtp === '123456') {
      setEmailStatus('sending');
      try {
        const { userService } = await import('@/services/userService');
        const result = await userService.verifyEmail(userEmail, emailOtp);
        if (result?.emailVerified) {
          setEmailStatus('verified');
          setFormData((prev: any) => ({ ...prev, emailVerified: true }));
        } else {
          setError('Email verification failed on server.');
          setEmailStatus('sent');
        }
      } catch (e) {
        setError('Error verifying email status.');
        setEmailStatus('sent');
      }
    } else {
      setError('Invalid Email PIN. Use the sandbox key provided below.');
    }
  };

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
        const { userService } = await import('@/services/userService');
        const fullPhone = `${formData.countryCode}${formData.phone.replace(/\s/g, '')}`;
        const result = await userService.verifyPhone(fullPhone);
        
        if (result?.phoneVerified) {
          setPhoneStatus('verified');
          setFormData((prev: any) => ({ 
            ...prev, 
            phoneVerified: true,
            phone: result.phone || prev.phone // Ensure sync
          }));
        } else {
          setError('Phone verification failed on server.');
          setPhoneStatus('sent');
        }
      } catch (e) {
        setError('Connection error during phone verification.');
        setPhoneStatus('sent');
      }
    } else {
      setError('Invalid PIN. Use the sandbox key provided below.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      className="space-y-8 pb-10 max-w-4xl mx-auto px-1"
    >
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 shadow-sm">
          <Fingerprint size={12} className="animate-pulse" />
          Security Protocol
        </div>
        
        <div className="space-y-1">
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            {t('title')}
          </h3>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <VerificationCard
          id="email-card"
          label={t('emailLabel')}
          value={userEmail}
          icon={<Mail className="w-6 h-6 sm:w-7 sm:h-7" />}
          status={emailStatus}
          otpValue={emailOtp}
          setOtpValue={setEmailOtp}
          onSend={sendEmailOtp}
          onVerify={verifyEmailOtp}
          onReset={() => {
            setEmailStatus('idle');
            setEmailOtp('');
          }}
          isResumed={formData.emailVerified}
          actionLabel={t('verifyProtocol')}
          t={t}
        />

        <VerificationCard
          id="phone-card"
          label={t('phoneLabel')}
          value={`${formData.countryCode} ${formData.phone}`}
          icon={<Phone className="w-6 h-6 sm:w-7 sm:h-7" />}
          status={phoneStatus}
          otpValue={phoneOtp}
          setOtpValue={setPhoneOtp}
          onSend={sendPhoneOtp}
          onVerify={verifyPhoneOtp}
          onReset={() => {
            setPhoneStatus('idle');
            setPhoneOtp('');
          }}
          isResumed={formData.phoneVerified}
          actionLabel={t('verifyProtocol')}
          t={t}
        />
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400 font-bold">{error}</p>
        </motion.div>
      )}

      {(phoneStatus === 'sent' || emailStatus === 'sent') && !(formData.phoneVerified && formData.emailVerified) && (
        <SandboxProtocol />
      )}
    </motion.div>
  );
}
