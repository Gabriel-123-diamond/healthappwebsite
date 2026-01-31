'use client';

import React, { useState, useEffect } from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { LogOut, User as UserIcon, Loader2, Menu, X, Globe, Sun, Moon, ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [platformMenuOpen, setPlatformMenuOpen] = useState(false);
  const platformMenuRef = React.useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (platformMenuRef.current && !platformMenuRef.current.contains(event.target as Node)) {
        setPlatformMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    localStorage.setItem('language', newLocale);
    router.push(pathname, { locale: newLocale });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t('common.search')}</Link>
          <Link href="/directory" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t('common.directory')}</Link>
          <Link href="/community" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t('common.community')}</Link>
          
          {/* Platform Dropdown */}
          <div className="relative" ref={platformMenuRef}>
            <button
              onClick={() => setPlatformMenuOpen(!platformMenuOpen)}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              Platform
              <ChevronDown className={`w-4 h-4 transition-transform ${platformMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {platformMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl py-2 z-50">
                <Link href="/seed" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => setPlatformMenuOpen(false)}>
                  Standard Seed (V1)
                </Link>
                <Link href="/admin/seed" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => setPlatformMenuOpen(false)}>
                  Admin Seed (V2)
                </Link>
                <Link href="/tools" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800 mt-1 pt-2" onClick={() => setPlatformMenuOpen(false)}>
                  Tools Dashboard
                </Link>
              </div>
            )}
          </div>

          {user && (
            <Link href="/saved" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t('common.saved')}</Link>
          )}
          <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t('common.about')}</Link>
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <LanguageSelector 
              currentLocale={locale} 
              onLocaleChange={handleLocaleChange} 
            />
            
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold">
                  {user.email?.[0].toUpperCase() || <UserIcon className="w-4 h-4" />}
                </div>
                <span>{t('common.profile')}</span>
              </Link>
              <button 
                onClick={handleSignOut}
                className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                title={t('common.signOut')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/signin" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">
                {t('common.signIn')}
              </Link>
              <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                {t('common.getStarted')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 shadow-lg absolute w-full">
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>{t('common.search')}</Link>
            <Link href="/directory" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>{t('common.directory')}</Link>
            <Link href="/community" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>{t('common.community')}</Link>
            {user && (
              <Link href="/saved" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>{t('common.saved')}</Link>
            )}
            <Link href="/about" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>{t('common.about')}</Link>
          </nav>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 pb-2">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Platform</p>
            <nav className="flex flex-col gap-3 pl-2 border-l-2 border-slate-100 dark:border-slate-800">
              <Link href="/seed" className="text-sm font-medium text-slate-600 dark:text-slate-300" onClick={() => setMobileMenuOpen(false)}>Standard Seed (V1)</Link>
              <Link href="/admin/seed" className="text-sm font-medium text-slate-600 dark:text-slate-300" onClick={() => setMobileMenuOpen(false)}>Admin Seed (V2)</Link>
              <Link href="/tools" className="text-sm font-medium text-blue-600 dark:text-blue-400" onClick={() => setMobileMenuOpen(false)}>Tools Dashboard</Link>
            </nav>
          </div>
          
          <div className="flex flex-col gap-2 py-2">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Select Language</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'es', label: 'Español' },
                { code: 'fr', label: 'Français' },
                { code: 'de', label: 'Deutsch' },
                { code: 'zh', label: '中文' },
                { code: 'ar', label: 'العربية' }
              ].map((lang) => (
                <button 
                  key={lang.code}
                  onClick={() => handleLocaleChange(lang.code)} 
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    locale === lang.code 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' 
                      : 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-400" />
            ) : user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{user.email}</span>
                </div>
                <Link href="/profile" className="block w-full text-center py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  {t('common.profile')}
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  {t('common.signOut')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link href="/auth/signin" className="flex items-center justify-center py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => setMobileMenuOpen(false)}>
                  {t('common.signIn')}
                </Link>
                <Link href="/auth/signup" className="flex items-center justify-center py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" onClick={() => setMobileMenuOpen(false)}>
                  {t('common.getStarted')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function LanguageSelector({ currentLocale, onLocaleChange }: { currentLocale: string, onLocaleChange: (loc: string) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const currentLang = languages.find(l => l.code === currentLocale) || languages[0];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
      >
        <span>{currentLang.flag}</span>
        <span className="uppercase">{currentLang.code}</span>
        <Globe className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-2xl p-2 z-[60]">
          <div className="grid grid-cols-1 gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLocaleChange(lang.code);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentLocale === lang.code 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                </div>
                {currentLocale === lang.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
