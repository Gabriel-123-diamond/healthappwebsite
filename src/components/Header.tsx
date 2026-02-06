'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';

import DesktopNav from './header/DesktopNav';
import AuthActions from './header/AuthActions';
import MobileMenu from './header/MobileMenu';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const locale = useLocale();
  const t = useTranslations();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="border-b bg-white dark:bg-slate-900 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">Ikiké Health AI</span>
          </Link>
        </div>

        <DesktopNav user={user} t={t} />

        <AuthActions 
          user={user} 
          loading={loading} 
          locale={locale} 
          t={t} 
          theme={theme}
          setTheme={setTheme}
          resolvedTheme={resolvedTheme}
        />

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-4">
           <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
      />
    </header>
  );
}