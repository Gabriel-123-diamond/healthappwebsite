'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, AlertCircle, Fingerprint, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';
import { useTranslations } from 'next-intl';
import { VerificationCard } from '../VerificationCard';
import { SandboxDebugControls } from './SandboxDebugControls';

interface VerificationStepProps {
  formData: any;
  setFormData: (data: any | ((prev: any) => any)) => void;
  refreshVerification: () => Promise<boolean>;
}

export default function VerificationStep({ formData, setFormData, refreshVerification }: VerificationStepProps) {
  const t = useTranslations('onboarding.security');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'verified'>(
    formData.emailVerified ? 'verified' : 'idle'
  );
  const [phoneStatus, setPhoneStatus] = useState<'idle' | 'sending' | 'sent' | 'verified'>(
    formData.phoneVerified ? 'verified' : 'idle'
  );
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');

  const userEmail = auth.currentUser?.email || 'user@example.com';

  const sendEmailOtp = async () => {
    setEmailStatus('sending');
    setError('');
    // For demo/sandbox purposes as per previous logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEmailStatus('sent');
  };

  const sendPhoneOtp = async () => {
    setPhoneStatus('sending');
    setError('');
    // For demo/sandbox purposes
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPhoneStatus('sent');
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
          setError('Email verification failed. Please check the code.');
          setEmailStatus('sent');
          setEmailOtp('');
        }
      } catch (e) {
        setError('Error verifying status.');
        setEmailStatus('sent');
      }
    } else if (emailOtp.length === 6) {
      setError('Invalid code. Please try again.');
      setEmailOtp('');
    }
  };

  const verifyPhoneOtp = async () => {
    if (phoneOtp === '123456') {
      setPhoneStatus('sending');
      try {
        const { userService } = await import('@/services/userService');
        const fullPhone = `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`;
        const result = await userService.verifyPhone(fullPhone);
        if (result?.phoneVerified) {
          setPhoneStatus('verified');
          setFormData((prev: any) => ({ ...prev, phoneVerified: true }));
        } else {
          setError('Phone verification failed. Please check the code.');
          setPhoneStatus('sent');
          setPhoneOtp('');
        }
      } catch (e) {
        setError('Error verifying status.');
        setPhoneStatus('sent');
      }
    } else if (phoneOtp.length === 6) {
      setError('Invalid code. Please try again.');
      setPhoneOtp('');
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setError('');
    try {
      const verified = await refreshVerification();
      if (verified) {
        setEmailStatus('verified');
        if (formData.role !== 'user') setPhoneStatus('verified');
      } else {
        if (formData.emailVerified) setEmailStatus('verified');
        if (formData.phoneVerified) setPhoneStatus('verified');
        if (!formData.emailVerified) {
          setError('Verification not complete. Please enter the code or click the link.');
        }
      }
    } catch (e) {
      setError('Failed to sync status.');
    } finally {
      setIsSyncing(false);
    }
  };

  const debugResetVerification = async () => {
    if (!auth.currentUser) return;
    setIsSyncing(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        emailVerified: false,
        phoneVerified: false
      }, { merge: true });
      
      setFormData((prev: any) => ({
        ...prev,
        emailVerified: false,
        phoneVerified: false
      }));
      setEmailStatus('idle');
      setPhoneStatus('idle');
      setError('Verification reset for testing.');
    } catch (e) {
      setError('Failed to reset.');
    } finally {
      setIsSyncing(false);
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
          actionLabel="Send Code"
          t={t}
        />

        {formData.role !== 'user' && (
          <VerificationCard
            id="phone-card"
            label={t('phoneLabel')}
            value={`${formData.countryCode}${formData.countryCode ? ' ' : ''}${formData.phone}`}
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
            actionLabel="Send Code"
            t={t}
          />
        )}
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

      {emailStatus === 'verified' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-[32px] border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest leading-none mb-1">Status Verified</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Your identity protocol is active. You may now proceed.</p>
          </div>
        </motion.div>
      )}
      
      <SandboxDebugControls
        emailStatus={emailStatus}
        emailVerified={formData.emailVerified}
        onReset={debugResetVerification}
      />
    </motion.div>
  );
}
