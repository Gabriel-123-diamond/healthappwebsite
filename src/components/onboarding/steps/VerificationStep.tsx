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

  const isFullyVerified = formData.emailVerified && formData.phoneVerified;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      className="space-y-12 pb-10"
    >
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.25em] border border-blue-500/20 shadow-sm">
          <Fingerprint size={14} className="animate-pulse" />
          Biometric Trust Verification
        </div>
        
        <div className="space-y-2">
          <h3 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.9]">
            Secure your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Identity.</span>
          </h3>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            We use a multi-layered security approach to ensure our platform remains a safe harbor for medical intelligence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 relative">
        {/* Connection Line */}
        <div className="absolute left-[40px] top-[100px] bottom-[100px] w-1 bg-gradient-to-b from-blue-500/20 via-blue-500/20 to-transparent hidden sm:block" />

        <VerificationCard
          id="email-card"
          label="Primary Email"
          value={userEmail}
          icon={<Mail className="w-6 h-6 sm:w-8 sm:h-8" />}
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
          icon={<Phone className="w-6 h-6 sm:w-8 sm:h-8" />}
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
            className="flex items-center gap-4 bg-red-500/5 dark:bg-red-500/10 p-8 rounded-[40px] border-2 border-red-500/20 shadow-2xl shadow-red-500/5 backdrop-blur-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30">
              <ShieldAlert size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Security Alert</p>
              <p className="text-sm text-red-900 dark:text-red-200 font-bold leading-tight">
                {error}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group p-1">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[42px] blur opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 shrink-0">
            <Lock size={28} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-black uppercase tracking-[0.1em] text-slate-900 dark:text-white">Encrypted Handshake Protocol</h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
              Your contact data is hashed and salted using industry-standard AES-256 encryption before transmission. We never share your private identifiers with third parties.
            </p>
          </div>
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
    <div className={`group relative p-8 sm:p-12 rounded-[48px] border-2 transition-all duration-1000 overflow-hidden ${
      isVerified 
        ? 'bg-emerald-500/5 border-emerald-500/50 dark:bg-emerald-900/10 shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)]' 
        : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-500/30'
    }`}>
      {/* Background Decor */}
      <div className={`absolute -right-20 -top-20 w-64 h-64 blur-3xl rounded-full transition-colors duration-1000 ${
        isVerified ? 'bg-emerald-500/10' : 'bg-blue-500/5 group-hover:bg-blue-500/10'
      }`} />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="flex items-start sm:items-center gap-8">
          <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center shrink-0 transition-all duration-700 ${
            isVerified 
              ? 'bg-emerald-500 text-white shadow-2xl shadow-emerald-500/50 scale-110' 
              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:-translate-y-1'
          }`}>
            {icon}
            {isVerified && (
              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute -top-3 -right-3 w-10 h-10 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl border-2 border-emerald-500/20"
              >
                <CheckCircle2 size={24} strokeWidth={3} />
              </motion.div>
            )}
          </div>
          
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{label}</p>
              {isResumed && (
                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full border border-blue-500/20">Saved</span>
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white break-all leading-tight tracking-tighter">
              {value}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {isVerified ? (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-4 px-8 py-4 bg-white dark:bg-slate-800 rounded-[24px] border border-emerald-500/20 shadow-xl shadow-emerald-500/5"
            >
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Security Check</span>
                <span className="text-xs font-bold text-slate-500">Identity Confirmed</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <ShieldCheck size={20} />
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-4">
              {isSent && (
                <button 
                  onClick={onReset}
                  className="p-5 text-slate-400 hover:text-blue-600 transition-all bg-slate-50 dark:bg-slate-800 hover:bg-blue-500/10 rounded-[24px] border border-transparent hover:border-blue-500/20"
                  title="Change Identifier"
                >
                  <RefreshCw size={20} />
                </button>
              )}
              <button 
                onClick={onSend}
                disabled={isSending || isSent}
                className={`group/btn relative overflow-hidden px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 min-w-[220px] shadow-2xl ${
                  isSent
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 shadow-none pointer-events-none'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] active:scale-95 shadow-slate-900/10 dark:shadow-none'
                }`}
              >
                {isSending ? (
                  <>Processing <Loader2 className="w-4 h-4 animate-spin" /></>
                ) : isSent ? (
                  <>Awaiting OTP <Send size={14} /></>
                ) : (
                  <>Secure Access <ArrowRightIcon /></>
                )}
                {!isSent && !isSending && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isSent && !isVerified && (
          <motion.div 
            initial={{ height: 0, opacity: 0, marginTop: 0 }} 
            animate={{ height: 'auto', opacity: 1, marginTop: 48 }} 
            exit={{ height: 0, opacity: 0, marginTop: 0 }} 
            className="pt-10 border-t-2 border-slate-50 dark:border-slate-800/50 space-y-8 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Verification Pin</label>
                  </div>
                  <div className="relative group/input">
                    <input 
                      type="text" 
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      placeholder="· · · · · ·"
                      className="w-full px-10 py-6 rounded-[32px] bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none font-mono text-4xl tracking-[0.4em] text-center font-black text-slate-900 dark:text-white shadow-inner transition-all"
                    />
                    <div className="absolute inset-0 rounded-[32px] border-2 border-blue-500/20 pointer-events-none group-focus-within/input:scale-105 opacity-0 group-focus-within/input:opacity-100 transition-all" />
                  </div>
                </div>
                <button 
                  onClick={onVerify}
                  disabled={otpValue.length < 6}
                  className="w-full py-6 bg-blue-600 text-white rounded-[32px] text-xs font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-12px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                >
                  Verify Protocol
                </button>
              </div>

              <div className="p-8 rounded-[32px] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                  <Sparkles size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Demo Environment</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  In this preview environment, use the magic bypass code <span className="font-black text-blue-600 dark:text-blue-400">123456</span> to complete the security handshake.
                </p>
                <button 
                  onClick={() => setOtpValue('123456')}
                  className="text-[10px] font-black uppercase text-blue-600 hover:underline tracking-widest"
                >
                  Autofill Bypass Code
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
      <path d="M1 7H17M17 7L11 1M17 7L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
