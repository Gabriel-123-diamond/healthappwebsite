'use client';

import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification
} from 'firebase/auth';
import { handleGoogleAuth, checkRedirectResult } from '@/services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRedirectPath } from '@/lib/authUtils';
import { useTranslations } from 'next-intl';
import { mapAuthCodeToKey, getAuthErrorCode } from '@/lib/authErrors';
import { AuthBackground, AuthMetadataTags, AuthScanline } from '@/components/auth/AuthElements';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  const t = useTranslations('auth');
  const rootT = useTranslations();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Handle URL referral code
  useEffect(() => {
    const ref = searchParams.get('ref') || searchParams.get('referral');
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, [searchParams]);

  // Handle redirect result on mount
  useEffect(() => {
    const initRedirect = async () => {
      try {
        const user = await checkRedirectResult();
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists()) {
            router.push('/onboarding');
          } else {
            const path = await getRedirectPath(user.uid);
            router.push(path);
          }
        }
      } catch (err: any) {
        setError(err.message || "Redirect authentication failed");
      }
    };
    initRedirect();
  }, [router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Store referral code for onboarding
      if (referralCode) {
        localStorage.setItem('pending_referral_code', referralCode.trim().toUpperCase());
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      router.push('/onboarding');
    } catch (err: any) {
      const code = getAuthErrorCode(err);
      const key = mapAuthCodeToKey(code);
      
      if (key === 'auth.errors.default' && err.message) {
        setError(err.message);
      } else {
        setError(rootT(key as any));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    try {
      // Store referral code for onboarding
      if (referralCode) {
        localStorage.setItem('pending_referral_code', referralCode.trim().toUpperCase());
      }

      const user = await handleGoogleAuth();
      // If user is null, it means we redirected (for mobile)
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          router.push('/onboarding');
        } else {
          const path = await getRedirectPath(user.uid);
          router.push(path);
        }
      }
    } catch (err: any) {
      const code = getAuthErrorCode(err);
      const key = mapAuthCodeToKey(code);
      
      if (key === 'auth.errors.default') {
        setError(`DEBUG: ${rootT(key as any)} (${code})`);
      } else if (err.message && (code === 'unknown' || key === 'auth.errors.default')) {
        setError(`DEBUG: ${err.message}`);
      } else {
        setError(`DEBUG: ${rootT(key as any)}`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 pt-32 sm:pt-40 relative overflow-hidden transition-colors">
      <AuthBackground />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <AuthMetadataTags />

        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-8 sm:p-14 rounded-[56px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border border-slate-200/50 dark:border-white/10 relative overflow-hidden group">
          <AuthScanline />
          
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-transparent pointer-events-none" />

          <div className="text-center mb-12 relative">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -5, boxShadow: '0 0 30px rgba(79, 70, 229, 0.3)' }}
              className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/30 border-4 border-white dark:border-slate-900 relative group/icon"
            >
              <ShieldCheck size={44} className="text-white relative z-10" strokeWidth={2.5} />
              <div className="absolute inset-0 bg-white/20 rounded-[28px] opacity-0 group-hover/icon:opacity-100 transition-opacity" />
            </motion.div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-2">
              Create Your Account
            </h1>
            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] ml-1">
              Get started with your secure profile
            </p>
          </div>

          <SignUpForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            referralCode={referralCode}
            setReferralCode={setReferralCode}
            loading={loading}
            error={error}
            onSubmit={handleSignUp}
            t={t}
          />

          <div className="mt-12 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100 dark:border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em]">
              <span className="bg-slate-50 dark:bg-[#020617] px-8 text-slate-400 transition-colors uppercase text-[9px] font-black tracking-widest">OR</span>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -3, boxShadow: '0 15px 30px -10px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignUp}
            className="mt-10 w-full py-5 bg-white dark:bg-slate-800/50 border-2 border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-200 rounded-[32px] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-5 hover:border-blue-500/30 hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-all shadow-sm group/google"
          >
            <div className="w-10 h-10 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center group-hover/google:scale-110 transition-transform duration-500">
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.78 1.85-1.63 2.42v2.01h2.64c1.55-1.42 2.43-3.52 2.43-5.44z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.64-2.01c-.73.48-1.66.76-2.64.76-2.85 0-5.27-1.92-6.13-4.51H2.18v2.09C3.99 20.24 7.75 23 12 23z" fill="#34A853"/>
                <path d="M5.87 14.58c-.22-.66-.35-1.36-.35-2.08s.13-1.42.35-2.08V8.33H2.18C1.43 9.81 1 11.46 1 13s.43 3.19 1.18 4.67l3.69-3.09z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.75 1 3.99 3.76 2.18 7.66l3.69 3.09c.86-2.59 3.28-4.51 6.13-4.51z" fill="#EA4335"/>
              </svg>
            </div>
            Sign up with Google
          </motion.button>

          <div className="mt-14 text-center">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-5">Already have an account?</p>
            <Link 
              href="/auth/signin" 
              className="inline-flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:text-blue-500 font-black uppercase tracking-[0.25em] text-[11px] group transition-all"
            >
              <span className="border-b-2 border-transparent group-hover:border-blue-500/50 transition-all pb-1">Sign In</span>
              <motion.div
                animate={{ x: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight size={14} strokeWidth={3} className="rotate-180" />
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
