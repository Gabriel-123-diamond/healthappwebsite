'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useRouter, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export const languages = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'zh', label: 'ZH', flag: '🇨🇳' },
  { code: 'ar', label: 'AR', flag: '🇸🇦' },
];

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    localStorage.setItem('language', newLocale);
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="bg-slate-50 dark:bg-white/[0.02] rounded-[28px] p-5 border border-slate-100 dark:border-white/5 transition-all hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 shadow-sm border border-slate-100 dark:border-white/10">
          <Globe size={18} />
        </div>
        <span className="text-[10px] sm:text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest leading-tight">System Language</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex flex-col items-center justify-center py-2.5 rounded-[16px] border transition-all ${
              locale === lang.code 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-[1.02]' 
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-blue-500/30'
            }`}
          >
            <span className="text-[10px] font-black tracking-wider">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
