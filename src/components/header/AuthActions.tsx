'use client';

import React from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { LogOut, User as UserIcon, Loader2, Sun, Moon, Globe, Check } from 'lucide-react';
import { User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Theme } from '@/context/ThemeContext';

interface AuthActionsProps {
  user: User | null;
  loading: boolean;
  locale: string;
  t: any;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme?: 'light' | 'dark';
}

export default function AuthActions({ user, loading, locale, t, setTheme, resolvedTheme }: AuthActionsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    localStorage.setItem('language', newLocale);
    router.push(pathname, { locale: newLocale });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="hidden md:flex items-center gap-4">
      <div className="flex items-center gap-2 mr-2">
        <LanguageSelector currentLocale={locale} onLocaleChange={handleLocaleChange} />
        
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
