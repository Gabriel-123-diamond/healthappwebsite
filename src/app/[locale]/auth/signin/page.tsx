'use client';

import React, { useState } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Mail, Loader2, ArrowRight, ShieldCheck, Cpu, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { PasswordField } from '@/components/common/PasswordField';
import { BaseInput } from '@/components/common/BaseInput';
import { useTranslations } from 'next-intl';

export default function SignInPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/profile');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/profile');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 pt-32 sm:pt-40 relative overflow-hidden transition-colors">
      {/* High-Tech Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Technical Metadata Tags */}
        <div className="flex justify-between items-center mb-4 px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[8px] font-black text-blue-600 dark:text-blue-400 tracking-tighter uppercase">
              <Cpu size={10} /> Node v4.2.0
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-600 dark:text-emerald-400 tracking-tighter uppercase">
              <Activity size={10} /> Active Protocol
            </div>
          </div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Secure-Login-Alpha</span>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-8 sm:p-14 rounded-[56px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border border-slate-200/50 dark:border-white/10 relative overflow-hidden group">
          {/* Subtle Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-20 dark:opacity-40" />
          
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent pointer-events-none" />

          <div className="text-center mb-12 relative">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5, boxShadow: '0 0 30px rgba(37, 99, 235, 0.3)' }}
              className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30 border-4 border-white dark:border-slate-900 relative group/icon"
            >
              <ShieldCheck size={44} className="text-white relative z-10" strokeWidth={2.5} />
              <div className="absolute inset-0 bg-white/20 rounded-[28px] opacity-0 group-hover/icon:opacity-100 transition-opacity" />
            </motion.div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-2">
              {t('welcomeBack')}
            </h1>
            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] ml-1">
              Initialize Access Protocol
            </p>
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
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-2xl flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest leading-tight">{error}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01, boxShadow: '0 0 25px rgba(37, 99, 235, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-[28px] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl shadow-slate-900/10 dark:shadow-blue-500/20 disabled:opacity-50 relative group/btn overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="relative z-10 flex items-center gap-4">
                  {t('signInBtn')} <ArrowRight size={18} strokeWidth={3} className="group-hover/btn:translate-x-1.5 transition-transform" />
                </span>
              )}
            </motion.button>
          </form>

          <div className="mt-12 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100 dark:border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em]">
              <span className="bg-white dark:bg-[#0B1221] px-8 text-slate-400 transition-colors">Federated Auth</span>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -3, boxShadow: '0 15px 30px -10px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
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
            Sign in with Google
          </motion.button>

          <div className="mt-14 text-center">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-5">Access Required?</p>
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:text-blue-500 font-black uppercase tracking-[0.25em] text-[11px] group transition-all"
            >
              <span className="border-b-2 border-transparent group-hover:border-blue-500/50 transition-all pb-1">Create intelligence node</span>
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight size={14} strokeWidth={3} />
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
