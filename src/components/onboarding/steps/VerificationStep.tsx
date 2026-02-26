'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ShieldCheck, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { auth } from '@/lib/firebase';

interface VerificationStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function VerificationStep({ formData, setFormData }: VerificationStepProps) {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'verified'>('idle');
  const [phoneStatus, setPhoneStatus] = useState<'idle' | 'sending' | 'sent' | 'verified'>('idle');
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [error, setError] = useState('');

  const userEmail = auth.currentUser?.email || 'your email';

  const sendEmailOtp = async () => {
    setEmailStatus('sending');
    setError('');
    setTimeout(() => setEmailStatus('sent'), 1500);
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
    setTimeout(() => setPhoneStatus('sent'), 1500);
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
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
          Step 3: Security Check
        </div>
        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Trust & Safety</h3>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
          Please verify your contact details to secure your account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Email Verification */}
        <div className={`p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border-2 transition-all duration-500 ${
          emailStatus === 'verified' 
            ? 'bg-emerald-50/30 border-emerald-500 dark:bg-emerald-900/10' 
            : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                emailStatus === 'verified' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Email Address</p>
                <p className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white break-all leading-tight">
                  {userEmail}
                </p>
              </div>
            </div>
            {emailStatus === 'verified' ? (
              <div className="flex items-center justify-center lg:justify-start gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 w-fit">
                <CheckCircle2 size={14} strokeWidth={3} /> Verified
              </div>
            ) : (
              <button 
                onClick={sendEmailOtp}
                disabled={emailStatus !== 'idle'}
                className="w-full lg:w-auto px-6 sm:px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap shadow-xl shadow-slate-200 dark:shadow-none"
              >
                {emailStatus === 'sending' ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Send Verification'}
              </button>
            )}
          </div>

          <AnimatePresence>
            {emailStatus === 'sent' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6 overflow-hidden">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Enter 6-Digit Code</label>
                  <div className="flex flex-col xs:flex-row gap-4 items-center">
                    <input 
                      type="text" 
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="000000"
                      className="w-full xs:flex-1 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none font-mono text-2xl tracking-[0.5em] text-center font-black"
                    />
                    <button 
                      onClick={verifyEmailOtp}
                      className="w-full xs:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 whitespace-nowrap"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Verification */}
        <div className={`p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border-2 transition-all duration-500 ${
          phoneStatus === 'verified' 
            ? 'bg-emerald-50/30 border-emerald-500 dark:bg-emerald-900/10' 
            : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                phoneStatus === 'verified' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                <Phone className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Phone Number</p>
                <p className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white break-all leading-tight">
                  {formData.countryCode} {formData.phone}
                </p>
              </div>
            </div>
            {phoneStatus === 'verified' ? (
              <div className="flex items-center justify-center lg:justify-start gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 w-fit">
                <CheckCircle2 size={14} strokeWidth={3} /> Verified
              </div>
            ) : (
              <button 
                onClick={sendPhoneOtp}
                disabled={phoneStatus !== 'idle'}
                className="w-full lg:w-auto px-6 sm:px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap shadow-xl shadow-slate-200 dark:shadow-none"
              >
                {phoneStatus === 'sending' ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Send OTP'}
              </button>
            )}
          </div>

          <AnimatePresence>
            {phoneStatus === 'sent' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6 overflow-hidden">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Enter 6-Digit OTP</label>
                  <div className="flex flex-col xs:flex-row gap-4 items-center">
                    <input 
                      type="text" 
                      maxLength={6}
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      placeholder="000000"
                      className="w-full xs:flex-1 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none font-mono text-2xl tracking-[0.5em] text-center font-black"
                    />
                    <button 
                      onClick={verifyPhoneOtp}
                      className="w-full xs:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 whitespace-nowrap"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4 bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/20 shadow-sm">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-xs text-red-600 dark:text-red-400 font-black uppercase tracking-widest">
            {error}
          </p>
        </motion.div>
      )}

      <div className="flex items-start gap-4 bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/20">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
          We require two-factor verification for all members to ensure the platform remains a high-trust environment for health exchange.
        </p>
      </div>
    </motion.div>
  );
}
