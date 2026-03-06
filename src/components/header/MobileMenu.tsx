'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, LogIn, UserPlus, FileText, ChevronRight, User, Sparkles, Activity, LogOut, Globe, Check, Calendar, LayoutDashboard } from 'lucide-react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { User as AuthUser, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { NAVIGATION_LINKS } from '@/config/navigation';
import { Variants } from 'framer-motion';
import { userService } from '@/services/userService';
import { isExpertRole, UserProfile } from '@/types/user';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  userProfile: UserProfile | null;
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
  userProfile,
  loading,
  locale,
  t,
  resolvedTheme,
  onToggleTheme,
  mounted
}: MobileMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLanguages, setShowLanguages] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onClose();
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleLocaleChange = (newLocale: string) => {
    localStorage.setItem('language', newLocale);
    router.push(pathname, { locale: newLocale });
    setShowLanguages(false);
    onClose();
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={containerVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="xl:hidden fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col"
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

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10 custom-scrollbar">
            {/* User Profile Section if Logged In */}
            {user && (
              <motion.div variants={itemVariants} className="p-6 bg-slate-50 dark:bg-white/[0.03] rounded-[32px] border border-slate-100 dark:border-white/5 flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white font-black text-xl">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active Identity</p>
                  <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{user.email}</p>
                </div>
                <Link href="/profile" onClick={onClose} className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 border border-slate-100 dark:border-white/10 shadow-sm active:scale-95 transition-all">
                  <ChevronRight size={18} />
                </Link>
              </motion.div>
            )}

            {/* Language Toggle Toggle */}
            <motion.div variants={itemVariants} className="space-y-4">
               <button 
                onClick={() => setShowLanguages(!showLanguages)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5 transition-all"
               >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                      <Globe size={16} className="text-blue-500" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Language</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{languages.find(l => l.code === locale)?.label}</span>
                    <ChevronRight size={16} className={`text-slate-300 transition-transform duration-300 ${showLanguages ? 'rotate-90' : ''}`} />
                  </div>
               </button>

               <AnimatePresence>
                 {showLanguages && (
                   <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden grid grid-cols-2 gap-2"
                   >
                     {languages.map((lang) => (
                       <button
                        key={lang.code}
                        onClick={() => handleLocaleChange(lang.code)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                          locale === lang.code 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'
                        }`}
                       >
                         <span>{lang.flag} {lang.label}</span>
                         {locale === lang.code && <Check size={12} />}
                       </button>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>
            </motion.div>

            {/* Main Links */}
            <div className="space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Intelligence Grid</p>
              <nav className="flex flex-col gap-1">
                {NAVIGATION_LINKS.map((link) => (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link 
                      href={link.href} 
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 group transition-all" 
                      onClick={onClose}
                    >
                      <span className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                        {t(link.labelKey) || link.defaultLabel}
                      </span>
                      <ChevronRight size={20} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Utility Grid */}
            <div className="space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Core Tools</p>
              <div className="grid grid-cols-2 gap-4">
                {userProfile && isExpertRole(userProfile.role) ? (
                  <motion.div variants={itemVariants}>
                    <Link href="/expert/dashboard" onClick={onClose} className="flex flex-col gap-3 p-5 bg-blue-600 dark:bg-blue-500 rounded-[32px] border border-blue-500/30 transition-all active:scale-95 shadow-xl shadow-blue-500/20 group">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-sm">
                        <LayoutDashboard size={20} />
                      </div>
                      <span className="font-black text-white text-[10px] uppercase tracking-[0.2em]">{t('profile.menu.expertDashboard')}</span>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div variants={itemVariants}>
                    <Link href="/profile" onClick={onClose} className="flex flex-col gap-3 p-5 bg-slate-50 dark:bg-white/[0.02] rounded-[32px] border border-slate-100 dark:border-white/5 transition-all hover:border-blue-500/30 group">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <User size={20} />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">Profile</span>
                    </Link>
                  </motion.div>
                )}
                <motion.div variants={itemVariants}>
                  <Link 
                    href={userProfile && isExpertRole(userProfile.role) ? "/expert/appointments" : "/appointments"} 
                    onClick={onClose} 
                    className="flex flex-col gap-3 p-5 bg-slate-50 dark:bg-white/[0.02] rounded-[32px] border border-slate-100 dark:border-white/5 transition-all hover:border-blue-500/30 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Calendar size={20} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Appointments</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-6 sm:p-8 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex flex-col gap-6">
              {!loading && !user ? (
                <div className="flex gap-4">
                  <Link 
                    href="/auth/signin" 
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black uppercase tracking-widest text-[10px] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm active:scale-95 transition-all"
                    onClick={onClose}
                  >
                    <LogIn size={14} /> {t('common.signIn')}
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                    onClick={onClose}
                  >
                    <UserPlus size={14} /> {t('common.getStarted')}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-black uppercase tracking-widest text-[10px] border border-red-100 dark:border-red-900/20 rounded-2xl active:scale-95 transition-all"
                  >
                    <LogOut size={14} /> {t('common.signOut')}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${mounted && resolvedTheme === 'dark' ? 'bg-indigo-500' : 'bg-amber-500'} animate-pulse`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Appearance</span>
                </div>
                <button 
                  onClick={onToggleTheme}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl transition-all active:scale-90"
                >
                  {mounted ? (
                    resolvedTheme === 'dark' ? (
                      <Moon size={18} className="text-indigo-400" />
                    ) : (
                      <Sun size={18} className="text-amber-500" />
                    )
                  ) : (
                    <div className="w-5 h-5" />
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
