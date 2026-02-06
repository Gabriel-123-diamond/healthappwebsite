'use client';

import React from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { LogOut, Loader2, X, Sun, Moon } from 'lucide-react';
import { User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  loading: boolean;
  locale: string;
  t: any;
  resolvedTheme?: string;
  onToggleTheme: () => void;
}

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  user, 
  loading, 
  locale, 
  t, 
  resolvedTheme, 
  onToggleTheme 
}: MobileMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (!isOpen) return null;

  const handleLocaleChange = (newLocale: string) => {
    localStorage.setItem('language', newLocale);
    router.push(pathname, { locale: newLocale });
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onClose();
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 shadow-lg absolute w-full left-0 z-[100]">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={onClose}>{t('common.search')}</Link>
        <Link href="/directory" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={onClose}>{t('common.directory')}</Link>
        <Link href="/community" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={onClose}>{t('common.community')}</Link>
        <Link href="/chat" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={onClose}>{t('common.chat')}</Link>
        {user && (
          <Link href="/saved" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={onClose}>{t('common.saved')}</Link>
        )}
        <Link href="/about" className="text-base font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" onClick={onClose}>{t('common.about')}</Link>
      </nav>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 pb-2">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Platform</p>
        <nav className="flex flex-col gap-3 pl-2 border-l-2 border-slate-100 dark:border-slate-800">
          <Link href="/seed" className="text-sm font-medium text-slate-600 dark:text-slate-300" onClick={onClose}>Standard Seed (V1)</Link>
          <Link href="/admin/seed" className="text-sm font-medium text-slate-600 dark:text-slate-300" onClick={onClose}>Admin Seed (V2)</Link>
          <Link href="/tools" className="text-sm font-medium text-blue-600 dark:text-blue-400" onClick={onClose}>Tools Dashboard</Link>
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
              <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{user.email}</span>
            </div>
            <Link href="/profile" className="block w-full text-center py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" onClick={onClose}>
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
            <Link href="/auth/signin" className="flex items-center justify-center py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800" onClick={onClose}>
              {t('common.signIn')}
            </Link>
            <Link href="/auth/signup" className="flex items-center justify-center py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" onClick={onClose}>
              {t('common.getStarted')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
