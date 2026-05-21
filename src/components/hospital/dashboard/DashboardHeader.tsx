'use client';

import React from 'react';
import { Building2, User } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  t: any;
  institutionName: string;
}

export function DashboardHeader({ t, institutionName }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <Building2 size={24} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('title')}</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          {t('managing', { name: institutionName || 'Institutional Node' })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/profile"
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
        >
          <User size={20} />
        </Link>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
        >
          {t('refresh')}
        </button>
      </div>
    </div>
  );
}
