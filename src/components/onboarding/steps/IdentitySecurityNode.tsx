'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function IdentitySecurityNode() {
  const t = useTranslations('onboarding.identity');

  return (
    <div className="sm:col-span-12 relative overflow-hidden p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-[40px] sm:rounded-[56px] shadow-2xl flex flex-col sm:flex-row items-center gap-8 group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-500/30 transition-all duration-700" />
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-[24px] flex items-center justify-center text-white shrink-0 rotate-3 group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-blue-500/40">
        <Shield size={32} strokeWidth={2.5} />
      </div>
      <div className="space-y-2 text-center sm:text-left">
        <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs">{t('securityProtocolActive')}</h4>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-bold leading-relaxed">
          {t('securityProtocolDesc1')}
          <span className="text-blue-400 dark:text-blue-600 mx-1">{t('securityProtocolDesc2')}</span> 
          {t('securityProtocolDesc3')}
        </p>
      </div>
    </div>
  );
}
