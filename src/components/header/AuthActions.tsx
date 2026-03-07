'use client';

import React from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { LogOut, User as UserIcon, Loader2, Sun, Moon, Globe, Check } from 'lucide-react';
import { User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Theme } from '@/context/ThemeContext';
import { userService } from '@/services/userService';
import { isExpertRole, UserProfile } from '@/types/user';
import { Calendar } from 'lucide-react';

interface AuthActionsProps {
  user: User | null;
  loading: boolean;
  locale: string;
  t: any;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme?: 'light' | 'dark';
  mounted?: boolean;
}

export default function AuthActions({ user, loading, locale, t, setTheme, resolvedTheme, mounted }: AuthActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    if (user && user.uid) {
      userService.getUserProfile(user.uid).then(setUserProfile);
    } else {
      setUserProfile(null);
    }
  }, [user]);

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
    <div className="flex items-center gap-1 xl:gap-2">
      <LanguageSelector currentLocale={locale} onLocaleChange={handleLocaleChange} />
      
      <button 
        onClick={toggleTheme}
        className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl transition-all active:scale-90 shadow-sm flex items-center justify-center"
      >
        {mounted ? (resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />) : <div className="w-4 h-4" />}
      </button>

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-400 mx-2" />
      ) : user ? (
        <div className="flex items-center gap-2 xl:gap-3">
          <Link href="/profile" className="flex items-center gap-2 p-1 pr-3 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl transition-all">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg">
              {user.email?.[0].toUpperCase() || <UserIcon className="w-4 h-4" />}
            </div>
            <span className="hidden 2xl:inline text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">{t('common.profile')}</span>
          </Link>
          <button 
            onClick={handleSignOut}
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title={t('common.signOut')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-1">
          <Link href="/auth/signin" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">
            {t('common.signIn')}
          </Link>
          <Link href="/auth/signup" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            {t('common.getStarted')}
          </Link>
        </div>
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
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black text-slate-700 dark:text-slate-300 hover:shadow-sm transition-all shadow-sm"
      >
        <span className="text-sm leading-none mb-0.5">{currentLang.flag}</span>
        <span className="uppercase tracking-widest">{currentLang.code}</span>
        <Globe className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-3 right-0 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLocaleChange(lang.code);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  currentLocale === lang.code 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{lang.flag}</span>
                  <span className="">{lang.label}</span>
                </div>
                {currentLocale === lang.code && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
