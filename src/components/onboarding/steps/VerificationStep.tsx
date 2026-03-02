'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ShieldCheck, Loader2, CheckCircle2, AlertCircle, Sparkles, Send, RefreshCw, Fingerprint } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useTranslations } from 'next-intl';

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
        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-900/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-blue-600 shadow-sm font-black">
              123
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest">Sandbox Protocol</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Use PIN: <span className="font-mono text-lg ml-1">123456</span></p>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-blue-400 animate-pulse hidden sm:block" />
        </div>
      )}
    </motion.div>
  );
}

interface VerificationCardProps {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  status: 'idle' | 'sending' | 'sent' | 'verified';
  otpValue: string;
  setOtpValue: (val: string) => void;
  onSend: () => void;
  onVerify: () => void;
  onReset: () => void;
  isResumed: boolean;
  actionLabel: string;
  t: any;
}

function VerificationCard({ id, label, value, icon, status, otpValue, setOtpValue, onSend, onVerify, onReset, isResumed, actionLabel, t }: VerificationCardProps) {
  const isVerified = status === 'verified';
  const isSent = status === 'sent';
  const isSending = status === 'sending';

  return (
    <div className={`group relative p-4 sm:p-6 md:p-7 rounded-[32px] border-2 transition-all duration-500 ${
      isVerified 
        ? 'bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-900/5' 
        : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-blue-500/30 shadow-sm'
    }`}>
      {/* Background decoration to fill space */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/30 dark:to-white/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <motion.div 
            layout
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
            isVerified 
              ? 'bg-emerald-500 text-white shadow-lg' 
              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600'
          }`}>
            {icon}
          </motion.div>
          
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
              <AnimatePresence>
                {isResumed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 bg-blue-500/10 text-blue-600 rounded-full border border-blue-500/20"
                  >
                    Saved
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <p className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white break-words leading-tight tracking-tight">
              {value}
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full xl:w-auto">
          <AnimatePresence mode="wait">
            {isVerified ? (
              <motion.div 
                key="verified"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center xl:justify-end gap-3 px-5 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 w-full xl:w-auto shadow-sm"
              >
                <CheckCircle2 size={16} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">{t('verifiedMember')}</span>
              </motion.div>
            ) : (
              <motion.div 
                key="actions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 w-full xl:w-auto"
              >
                {isSent && (
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="------"
                      className="w-full sm:w-32 px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-blue-500 rounded-xl text-center font-mono font-black text-lg tracking-[0.3em] outline-none shadow-inner"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onVerify}
                      className="px-6 py-3.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                    >
                      Confirm
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onReset}
                      className="p-3 sm:p-3.5 text-slate-400 hover:text-blue-600 transition-all bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent hover:border-blue-500/20 shadow-sm"
                      title={t('editInfo')}
                    >
                      <RefreshCw size={18} />
                    </motion.button>
                  </div>
                )}
                {!isSent && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSend}
                    disabled={isSending}
                    className={`flex-1 xl:flex-none px-6 sm:px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 xl:min-w-[180px] ${
                      isSending
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 pointer-events-none'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg hover:shadow-blue-500/20'
                    }`}
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>{actionLabel} <ArrowRightIcon /></>
                    )}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <motion.svg 
      width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 7H17M17 7L11 1M17 7L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </motion.svg>
  );
}
