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
import PushNotificationManager from './PushNotificationManager';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const locale = useLocale();
  const t = useTranslations();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/30 dark:border-slate-800/30 py-3 shadow-2xl shadow-blue-500/5' 
        : 'bg-transparent py-6 border-b border-transparent'
    }`}>
      <PushNotificationManager />
      {/* Scroll Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 origin-left z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
              <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight leading-none">
                Ikiké
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Health AI</span>
                <Sparkles className="w-2 h-2 text-blue-400 opacity-50" />
              </div>
            </div>
          </Link>
        </div>

        <div className="hidden xl:block">
          <DesktopNav user={user} t={t} />
        </div>

        <div className="hidden xl:block">
          <AuthActions 
            user={user} 
            loading={loading} 
            locale={locale} 
            t={t} 
            theme={theme}
            setTheme={setTheme}
            resolvedTheme={resolvedTheme}
            mounted={mounted}
          />
        </div>

        {/* Mobile Controls */}
        <div className="xl:hidden flex items-center gap-2">
           <button 
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl transition-all active:scale-90 shadow-sm"
            >
              {mounted && (resolvedTheme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />)}
              {!mounted && <div className="w-4.5 h-4.5" />}
            </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-slate-600 dark:text-slate-300 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl transition-all active:scale-90 shadow-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        loading={loading}
        locale={locale}
        t={t}
        resolvedTheme={resolvedTheme}
        onToggleTheme={toggleTheme}
        mounted={mounted}
      />
    </header>
  );
}
