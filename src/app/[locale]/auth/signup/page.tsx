'use client';

import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Chrome, Ticket, Check, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { PasswordField } from '@/components/common/PasswordField';
import { BaseInput } from '@/components/common/BaseInput';
import { getRedirectPath } from '@/lib/authUtils';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true); // Start as loading to check auth
  const [error, setError] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const refFromUrl = searchParams.get('ref');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const path = await getRedirectPath(user.uid);
        router.push(path);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (refFromUrl) {
      setReferralCode(refFromUrl.toUpperCase());
    }
  }, [refFromUrl]);

  const handleAuthSuccess = async (user: any) => {
    if (!user) return;
    
    // Check for referral code and return destination
    const finalRefCode = referralCode || refFromUrl;
    
    const path = await getRedirectPath(user.uid);
    if (path === '/onboarding' && finalRefCode) {
      router.push(`/onboarding?ref=${finalRefCode}`);
    } else {
      router.push(path);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError(t.auth.passwordsNoMatch);
      return;
    }
    setLoading(true);
    setError('');

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await handleAuthSuccess(result.user);
    } catch (err: any) {
      setError(err.message || t.auth.failedCreate);
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleAuthSuccess(result.user);
    } catch (err: any) {
      console.error("Google Sign Up Error:", err);
      if (err.message && (err.message.includes('AppCheck') || err.message.includes('403'))) {
        setError(t.auth.appCheckError);
      } else {
        setError(err.message || t.auth.failedCreate);
      }
      setLoading(false);
    }
  };

  if (loading && !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 pt-24 sm:pt-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full space-y-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 sm:p-12 rounded-[48px] shadow-3xl shadow-blue-900/10 border border-white dark:border-slate-800 relative z-10"
      >
        <div className="text-center">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -5 }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20"
          >
            <span className="text-white font-black text-2xl">I</span>
          </motion.div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{t.auth.createAccount}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed opacity-80">
            {t.auth.joinToAccess}
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSignUp}>
          <div className="space-y-5">
            <BaseInput
              id="email"
              name="email"
              type="email"
              label={t.auth.email}
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.auth.email}
              prefixIcon={<Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />}
              className="py-4 !rounded-2xl"
            />
            <PasswordField
              id="password"
              name="password"
              label={t.auth.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.password}
              required
              autoComplete="new-password"
              className="py-4 !rounded-2xl"
            />
            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              label={t.auth.confirmPassword}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t.auth.confirmPassword}
              required
              autoComplete="new-password"
              className="py-4 !rounded-2xl"
            />

            <BaseInput
              id="referralCode"
              name="referralCode"
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase().trim())}
              placeholder="REFERRAL CODE (OPTIONAL)"
              prefixIcon={<Ticket className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />}
              suffixIcon={refFromUrl ? (
                <div className="p-1 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                  <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
              ) : null}
              className="font-mono tracking-wider !rounded-2xl py-4"
              containerClassName="group"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest text-center bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/30"
            >
              {error}
            </motion.div>
          )}

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-xs font-black uppercase tracking-[0.2em] rounded-[20px] text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.auth.signUp}
            </motion.button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
            <span className="px-4 bg-white dark:bg-slate-900 text-slate-400">{t.auth.orContinue}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(248, 250, 252, 1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-slate-100 dark:border-slate-800 rounded-[20px] text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
        >
          <Chrome className="w-5 h-5 text-blue-500" />
          Google Identity
        </motion.button>

        <div className="text-center pt-4">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {t.auth.alreadyHaveAccount}{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-black uppercase tracking-widest ml-1">
              {t.auth.signIn}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}