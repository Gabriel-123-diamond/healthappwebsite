'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Menu, X, Sun, Moon, Activity, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';

import DesktopNav from './header/DesktopNav';
import AuthActions from './header/AuthActions';
import MobileMenu from './header/MobileMenu';
import VipUpgradeButton from './header/VipUpgradeButton';
import PushNotificationManager from './PushNotificationManager';
import { UserProfile } from '@/types/user';
import { userService } from '@/services/userService';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  const locale = useLocale();
  const t = useTranslations();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    // Sync with admin session
    setIsAdminAuthenticated(sessionStorage.getItem('isAdminAuthenticated') === 'true');

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profile = await userService.getUserProfile(currentUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile in header:", error);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    const handleScroll = () => {
      const winScroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (winScroll / height) * 100;
      
      setScrollProgress(scrolled);
      setScrolled(winScroll > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 py-3 shadow-2xl shadow-blue-500/5' 
        : 'bg-transparent py-6 border-b border-transparent'
    }`}>
      <PushNotificationManager />
      {/* Scroll Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 origin-left z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 shadow-sm" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white tracking-tighter leading-none">
                  Ikiké
                </span>
                {(userProfile?.tier === 'vip1' || userProfile?.tier === 'vip2' || userProfile?.tier === 'premium') && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20">
                    {userProfile.tier === 'vip1' ? 'PLUS' : 'PREMIUM'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.3em] text-blue-600/80 dark:text-blue-400/80">Health AI</span>
                <Sparkles className="w-2 h-2 text-blue-400 opacity-50" />
              </div>
            </div>
          </Link>

          <div className="hidden lg:block">
            <DesktopNav user={user} userProfile={userProfile} t={t} />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
          <AuthActions 
            user={user} 
            loading={loading} 
            locale={locale} 
            t={t} 
            theme={theme}
            setTheme={setTheme}
            resolvedTheme={resolvedTheme}
            mounted={mounted}
            isAdminAuthenticated={isAdminAuthenticated}
          />
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden flex items-center gap-2">
           <VipUpgradeButton userProfile={userProfile} className="mr-1" />
           <button 
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl transition-all active:scale-90 shadow-sm"
            >
              {mounted && (resolvedTheme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />)}
              {!mounted && <div className="w-4.5 h-4.5" />}
            </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl transition-all active:scale-90 shadow-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        userProfile={userProfile}
        loading={loading}
        locale={locale}
        t={t}
        resolvedTheme={resolvedTheme}
        onToggleTheme={toggleTheme}
        mounted={mounted}
        isAdminAuthenticated={isAdminAuthenticated}
      />
    </motion.header>
  );
}
