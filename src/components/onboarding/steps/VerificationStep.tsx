'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ShieldCheck, Loader2, CheckCircle2, AlertCircle, Sparkles, Send, RefreshCw, Fingerprint, ShieldAlert, Lock } from 'lucide-react';
import { auth } from '@/lib/firebase';

interface VerificationStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function VerificationStep({ formData, setFormData }: VerificationStepProps) {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'verified'>(
    formData.emailVerified ? 'verified' : 'idle'
  );
  const [phoneStatus, setPhoneStatus] = useState<'idle' | 'sending' | 'sent' | 'verified'>(
    formData.phoneVerified ? 'verified' : 'idle'
  );
  
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [error, setError] = useState('');

  // Sync with formData in case it changes externally (e.g., resumed from DB)
  useEffect(() => {
    if (formData.emailVerified) setEmailStatus('verified');
    if (formData.phoneVerified) setPhoneStatus('verified');
  }, [formData.emailVerified, formData.phoneVerified]);

  const userEmail = auth.currentUser?.email || 'your email';

  const sendEmailOtp = async () => {
    setEmailStatus('sending');
    setError('');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setEmailStatus('sent');
  };

  const verifyEmailOtp = async () => {
    if (emailOtp === '123456') {
      setEmailStatus('verified');
      setFormData({ ...formData, emailVerified: true });
    } else {
      setError('Invalid Email OTP. Try 123456 for demo.');
    }
  };

  const sendPhoneOtp = async () => {
    setPhoneStatus('sending');
    setError('');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPhoneStatus('sent');
  };

  const verifyPhoneOtp = async () => {
    if (phoneOtp === '123456') {
      setPhoneStatus('verified');
      setFormData({ ...formData, phoneVerified: true });
    } else {
      setError('Invalid Phone OTP. Try 123456 for demo.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      className="space-y-8 pb-10 max-w-4xl mx-auto"
    >
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 shadow-sm">
          <Fingerprint size={12} className="animate-pulse" />
          Security Protcol
        </div>
        
        <div className="space-y-1">
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Secure your <span className="text-blue-600">Identity.</span>
          </h3>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            Verify your contact details to enable full platform access.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <VerificationCard
          id="email-card"
          label="Primary Email"
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
        />

        <VerificationCard
          id="phone-card"
          label="Secure Phone"
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
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="flex items-center gap-4 bg-red-500/5 dark:bg-red-500/10 p-5 rounded-3xl border border-red-500/20 shadow-xl shadow-red-500/5"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0">
              <ShieldAlert size={20} />
            </div>
            <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group p-px">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-10" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
            <Lock size={20} />
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Your contact data is encrypted using AES-256 standards. We prioritize your privacy above all else.
          </p>
        </div>
      </div>
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
}

function VerificationCard({ id, label, value, icon, status, otpValue, setOtpValue, onSend, onVerify, onReset, isResumed }: VerificationCardProps) {
  const isVerified = status === 'verified';
  const isSent = status === 'sent';
  const isSending = status === 'sending';

  return (
    <div className={`group relative p-5 sm:p-7 rounded-[32px] border-2 transition-all duration-500 ${
      isVerified 
        ? 'bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-900/5' 
        : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-blue-500/30 shadow-sm'
    }`}>
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <motion.div 
            layout
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
            isVerified 
              ? 'bg-emerald-500 text-white shadow-lg' 
              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600'
          }`}>
            {icon}
          </motion.div>
          
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
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
            <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white break-words leading-tight tracking-tight">
              {value}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <AnimatePresence mode="wait">
            {isVerified ? (
              <motion.div 
                key="verified"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20"
              >
                <CheckCircle2 size={16} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
              </motion.div>
            ) : (
              <motion.div 
                key="actions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                {isSent && (
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onReset}
                    className="p-3.5 text-slate-400 hover:text-blue-600 transition-all bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent hover:border-blue-500/20"
                    title="Edit Info"
                  >
                    <RefreshCw size={18} />
                  </motion.button>
                )}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSend}
                  disabled={isSending || isSent}
                  className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 min-w-[160px] ${
                    isSent
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 pointer-events-none'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg hover:shadow-blue-500/20'
                  }`}
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isSent ? (
                    <>Sent <Send size={12} /></>
                  ) : (
                    <>Verify <ArrowRightIcon /></>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isSent && !isVerified && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1, marginTop: 24 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2 w-full">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Pin</label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="000000"
                  className="w-full px-6 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none font-mono text-xl tracking-[0.4em] text-center font-black text-slate-900 dark:text-white shadow-inner transition-all focus:bg-white dark:focus:bg-slate-900"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#1d4ed8' }}
                whileTap={{ scale: 0.95 }}
                onClick={onVerify}
                disabled={otpValue.length < 6}
                className="w-full sm:w-auto px-10 py-3.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 transition-all"
              >
                Confirm
              </motion.button>
            </div>
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-2xl bg-blue-500/5 dark:bg-blue-900/10 border border-blue-500/10 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-blue-500" />
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                  Demo Code: <span className="text-blue-600 font-black tracking-widest">123456</span>
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOtpValue('123456')}
                className="text-[9px] font-black uppercase text-blue-600 hover:underline flex items-center gap-1"
              >
                Autofill <Send size={8} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <motion.svg 
      initial={{ x: 0 }}
      animate={{ x: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      width="14" height="12" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 7H17M17 7L11 1M17 7L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </motion.svg>
  );
}
