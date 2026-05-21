'use client';

import React from 'react';
import { Fingerprint, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function IdentityHeaderNode() {
  const t = useTranslations('onboarding.identity');

  return (
    <div className="relative">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
      <div className="space-y-6 relative z-10">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
          <Fingerprint size={14} strokeWidth={3} />
          {t('title')}
        </div>
        
        <div className="space-y-3">
          <h3 className="text-3xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] flex flex-wrap items-center gap-x-4">
            {t('title').split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "text-blue-600" : ""}>{word}</span>
            ))}
            <Sparkles className="text-blue-500 w-8 h-8 sm:w-12 sm:h-12 animate-pulse" />
          </h3>
          <p className="text-sm sm:text-lg text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-2xl">
            {t('subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}
