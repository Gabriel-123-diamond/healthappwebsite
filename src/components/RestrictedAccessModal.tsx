'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LogIn, UserPlus, X, Sparkles, ShieldCheck, BookOpen } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface RestrictedAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const RestrictedAccessModal: React.FC<RestrictedAccessModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "Intelligence Protocol Locked",
  description = "Sign in or initialize your identity node to unlock comprehensive clinical documentation, scientific trials, and verified health insights."
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Accent */}
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:20px_20px]" />
               <button 
                 onClick={onClose}
                 className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
               >
                 <X size={18} strokeWidth={3} />
               </button>
            </div>

            <div className="p-6 sm:p-12 text-center relative z-10">
               <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-slate-800 rounded-[24px] sm:rounded-[32px] flex items-center justify-center mx-auto mb-10 sm:mb-12 shadow-2xl border-8 border-slate-50 dark:border-slate-950 -mt-16 sm:-mt-20">
                  <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" strokeWidth={2.5} />
               </div>

               <div className="space-y-4 mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100 dark:border-blue-800/50 mb-2">
                     <Sparkles size={12} strokeWidth={3} />
                     Access Verification Required
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-[0.95]">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto italic">
                    {description}
                  </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link 
                    href="/auth/signin" 
                    className="flex items-center justify-center gap-2 px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 dark:hover:bg-blue-50 transition-all shadow-xl active:scale-95"
                  >
                    <LogIn size={14} strokeWidth={3} /> Sign In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="flex items-center justify-center gap-2 px-8 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-xl active:scale-95"
                  >
                    <UserPlus size={14} strokeWidth={3} /> Join Network
                  </Link>
               </div>

               <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center gap-1 opacity-40">
                    <ShieldCheck size={16} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Encrypted</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-40">
                    <BookOpen size={16} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Scientific</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
