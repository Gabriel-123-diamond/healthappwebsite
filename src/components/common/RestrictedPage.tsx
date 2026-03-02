'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, LogIn, UserPlus, Sparkles, ShieldCheck, BookOpen, ChevronRight, Globe, Users } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface RestrictedPageProps {
  title?: string;
  description?: string;
  badge?: string;
}

export const RestrictedPage: React.FC<RestrictedPageProps> = ({ 
  title = "Intelligence Registry Restricted",
  description = "The verified expert directory and clinical specialist registry are exclusive to authenticated members. Sign in or initialize your node to access the network.",
  badge = "Access Verification Required"
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 pt-32 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full relative z-10"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[64px] border border-white dark:border-slate-800 p-8 sm:p-16 shadow-3xl shadow-blue-900/5 text-center">
          {/* Icon */}
          <div className="relative w-24 h-24 mx-auto mb-10">
            <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 animate-pulse" />
            <div className="relative w-full h-full bg-blue-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Lock className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100 dark:border-blue-800/50 mb-6">
            <Sparkles size={12} className="animate-pulse" />
            {badge}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.95] mb-6">
            {title}
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md mx-auto mb-12 italic">
            {description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <Link 
              href="/auth/signin" 
              className="flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 dark:hover:bg-blue-50 transition-all shadow-xl active:scale-95 group"
            >
              <LogIn size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" /> 
              Authenticate Node
            </Link>
            <Link 
              href="/auth/signup" 
              className="flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-xl active:scale-95 group"
            >
              <UserPlus size={16} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> 
              Initialize Access
            </Link>
          </div>

          {/* Verification Pillars */}
          <div className="pt-10 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <ShieldCheck size={20} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Verified Pros</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Users size={20} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Expert Care</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Globe size={20} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Global Network</span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black uppercase tracking-widest text-[10px]">
            <ChevronRight size={14} className="rotate-180" /> Return to Terminal
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
