'use client';

import React, { useState, useEffect } from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { LogOut, User as UserIcon, Loader2, Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, t } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLocaleChange = (newLocale: string) => {
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
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">HealthAI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t.common.search}</Link>
          <Link href="/directory" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t.common.directory}</Link>
          <Link href="/community" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t.common.community}</Link>
          {user && (
            <Link href="/saved" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t.common.saved}</Link>
          )}
          <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t.common.about}</Link>
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
             <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => handleLocaleChange('en')} 
                className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${locale === 'en' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                EN
              </button>
              <button 
                onClick={() => handleLocaleChange('es')} 
                className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${locale === 'es' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                ES
              </button>
              <button 
                onClick={() => handleLocaleChange('fr')} 
                className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${locale === 'fr' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                FR
              </button>
            </div>
            
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
                <span>{t.common.profile}</span>
              </Link>
              <button 
                onClick={handleSignOut}
                className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                title={t.common.signOut}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/signin" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">
                {t.common.signIn}
              </Link>
              <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                {t.common.getStarted}
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
            <Link href="/" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>{t.common.search}</Link>
            <Link href="/directory" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>{t.common.directory}</Link>
            <Link href="/community" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>{t.common.community}</Link>
            {user && (
              <Link href="/saved" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>{t.common.saved}</Link>
            )}
            <Link href="/about" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>{t.common.about}</Link>
          </nav>
          
          <div className="flex items-center gap-2 py-2">
             <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-full justify-center">
              <button 
                onClick={() => handleLocaleChange('en')} 
                className={`flex-1 px-2 py-1 rounded-md text-xs font-bold transition-all ${locale === 'en' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
              >
                EN
              </button>
              <button 
                onClick={() => handleLocaleChange('es')} 
                className={`flex-1 px-2 py-1 rounded-md text-xs font-bold transition-all ${locale === 'es' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
              >
                ES
              </button>
              <button 
                onClick={() => handleLocaleChange('fr')} 
                className={`flex-1 px-2 py-1 rounded-md text-xs font-bold transition-all ${locale === 'fr' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
              >
                FR
              </button>
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
                  {t.common.profile}
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  {t.common.signOut}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link href="/auth/signin" className="flex items-center justify-center py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => setMobileMenuOpen(false)}>
                  {t.common.signIn}
                </Link>
                <Link href="/auth/signup" className="flex items-center justify-center py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" onClick={() => setMobileMenuOpen(false)}>
                  {t.common.getStarted}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
