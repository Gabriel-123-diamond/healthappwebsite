'use client';

import React, { useState } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { handleGoogleAuth, checkRedirectResult } from '@/services/authService';
import { Mail, Loader2, ArrowRight, ShieldCheck, Cpu, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { PasswordField } from '@/components/common/PasswordField';
import { BaseInput } from '@/components/common/BaseInput';
import { useTranslations } from 'next-intl';
import { mapAuthCodeToKey, getAuthErrorCode } from '@/lib/authErrors';
import { SignInBackground } from '@/components/auth/SignInBackground';

import { getRedirectPath } from '@/lib/authUtils';

export default function SignInPage() {
  const t = useTranslations('auth');
  const rootT = useTranslations();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  React.useEffect(() => {
    const initRedirect = async () => {
      try {
        const user = await checkRedirectResult();
        if (user) {
          const path = await getRedirectPath(user.uid);
          router.push(path as any);
        }
      } catch (err: any) {
        setError(err.message || "Redirect authentication failed");
      }
    };
    initRedirect();
  }, [router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const path = await getRedirectPath(userCredential.user.uid);
      router.push(path as any);
    } catch (err: any) {
      const code = getAuthErrorCode(err);
      const key = mapAuthCodeToKey(code);
      setError(key === 'auth.errors.default' && err.message ? err.message : rootT(key as any));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await handleGoogleAuth();
      if (user) {
        const path = await getRedirectPath(user.uid);
        router.push(path as any);
      }
    } catch (err: any) {
      const code = getAuthErrorCode(err);
      const key = mapAuthCodeToKey(code);
      setError(`DEBUG: ${rootT(key as any)}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 pt-32 sm:pt-40 relative overflow-hidden transition-colors">
      <SignInBackground />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="flex justify-between items-center mb-4 px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[8px] font-black text-blue-600 dark:text-blue-400 tracking-tighter uppercase">
              <Cpu size={10} /> v4.2.0
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-600 dark:text-emerald-400 tracking-tighter uppercase">
              <Activity size={10} /> System Online
            </div>
          </div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Secure-Login-Alpha</span>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-8 sm:p-14 rounded-[56px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border border-slate-200/50 dark:border-white/10 relative overflow-hidden group">
          <div className="text-center mb-12 relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30 border-4 border-white dark:border-slate-900">
              <ShieldCheck size={44} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-2">{t('welcomeBack')}</h1>
            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] ml-1">Secure Sign In</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-7 relative">
            <BaseInput
              id="email"
              label={t('emailLabel')}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              autoComplete="email"
              prefixIcon={<Mail className="w-4 h-4 text-slate-400" />}
              className="dark:bg-black/20"
            />

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{t('passwordLabel')}</label>
                <Link href="/auth/forgot-password" className="text-[9px] font-black uppercase text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors tracking-widest">
                  Recover Credentials
                </Link>
              </div>
              <PasswordField
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                autoComplete="current-password"
                className="dark:bg-black/20"
              />
            </div>

            {error && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-start gap-4">
                <ShieldCheck className="text-red-500 w-5 h-5 mt-1" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Authentication Alert</p>
                  <p className="text-red-600 dark:text-red-400 text-[11px] font-bold leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-[28px] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl shadow-slate-900/10 dark:shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('signInBtn')} <ArrowRight size={18} strokeWidth={3} /></>}
            </button>
          </form>

          <div className="mt-12 relative flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-white/5"></div>
            <span className="absolute left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-4 text-slate-400 text-[9px] font-black tracking-widest">OR</span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="mt-10 w-full py-5 bg-white dark:bg-slate-800/50 border-2 border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-200 rounded-[32px] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-5 hover:border-blue-500/30 transition-all shadow-sm"
          >
            <div className="w-10 h-10 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.78 1.85-1.63 2.42v2.01h2.64c1.55-1.42 2.43-3.52 2.43-5.44z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.64-2.01c-.73.48-1.66.76-2.64.76-2.85 0-5.27-1.92-6.13-4.51H2.18v2.09C3.99 20.24 7.75 23 12 23z" fill="#34A853"/><path d="M5.87 14.58c-.22-.66-.35-1.36-.35-2.08s.13-1.42.35-2.08V8.33H2.18C1.43 9.81 1 11.46 1 13s.43 3.19 1.18 4.67l3.69-3.09z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.75 1 3.99 3.76 2.18 7.66l3.69 3.09c.86-2.59 3.28-4.51 6.13-4.51z" fill="#EA4335"/></svg>
            </div>
            Sign in with Google
          </button>

          <div className="mt-14 text-center">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-5">New User?</p>
            <Link href="/auth/signup" className="inline-flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:text-blue-500 font-black uppercase tracking-[0.25em] text-[11px]">
              <span>Create an account</span>
              <ArrowRight size={14} strokeWidth={3} />
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
            <Link href="/admin/login" className="text-[9px] font-black uppercase text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors tracking-[0.3em]">
              System Administrator Portal
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
