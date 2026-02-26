'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, LogIn, UserPlus, FileText, ChevronRight, User, Sparkles, Activity } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { User as AuthUser } from 'firebase/auth';
import { NAVIGATION_LINKS } from '@/config/navigation';
import { Variants } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  loading: boolean;
  locale: string;
  t: any;
  resolvedTheme?: string;
  onToggleTheme: () => void;
  mounted?: boolean;
}

const containerVariants: Variants = {
  closed: { 
    opacity: 0,
    x: '100%',
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  },
  open: { 
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  closed: { opacity: 0, x: 20 },
  open: { opacity: 1, x: 0 }
};

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  loading,
  locale,
  t,
  resolvedTheme,
  onToggleTheme,
  mounted
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={containerVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="lg:hidden fixed inset-0 z-[100] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl flex flex-col"
        >
          {/* Top Bar inside Fullscreen Menu */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ikiké Menu</span>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 active:scale-90 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {/* User Profile Section if Logged In */}
            {user && (
              <motion.div variants={itemVariants} className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[32px] border border-blue-100 dark:border-blue-800/50 flex items-center gap-4">
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="text-blue-600" size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active Session</p>
                  <p className="font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                </div>
                <Link href="/profile" onClick={onClose} className="p-2 bg-blue-600 rounded-xl text-white">
                  <ChevronRight size={18} />
                </Link>
              </motion.div>
            )}

            {/* Main Links */}
            <div className="space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Intelligence Grid</p>
              <nav className="flex flex-col gap-2">
                {NAVIGATION_LINKS.map((link) => (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link 
                      href={link.href} 
                      className="flex items-center justify-between p-4 text-2xl font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors tracking-tighter" 
                      onClick={onClose}
                    >
                      {t(link.labelKey) || link.defaultLabel}
                      <ChevronRight size={20} className="text-slate-300" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Utility Grid */}
            <div className="space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Core Tools</p>
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <Link href="/saved" onClick={onClose} className="flex flex-col gap-3 p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-500/30">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 shadow-sm">
                      <FileText size={20} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Saved</span>
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link href="/about" onClick={onClose} className="flex flex-col gap-3 p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-500/30">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 shadow-sm">
                      <Sparkles size={20} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">About</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-8 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex flex-col gap-6">
              {!loading && !user && (
                <div className="flex gap-4">
                  <Link 
                    href="/auth/signin" 
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black uppercase tracking-widest text-[10px] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm"
                    onClick={onClose}
                  >
                    <LogIn size={14} /> {t('auth.signIn')}
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-blue-500/20"
                    onClick={onClose}
                  >
                    <UserPlus size={14} /> {t('auth.signUp')}
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${mounted && resolvedTheme === 'dark' ? 'bg-indigo-500' : 'bg-amber-500'} animate-pulse`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Theme</span>
                </div>
                <button 
                  onClick={onToggleTheme}
                  className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm"
                >
                  {mounted ? (
                    resolvedTheme === 'dark' ? (
                      <><Moon size={14} className="text-indigo-400" /> <span className="text-xs font-bold text-slate-300">Dark Mode</span></>
                    ) : (
                      <><Sun size={14} className="text-amber-500" /> <span className="text-xs font-bold text-slate-600">Light Mode</span></>
                    )
                  ) : (
                    <div className="w-24 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}