'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

interface ExpertLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backLink?: string;
  actions?: React.ReactNode;
}

export const ExpertLayout: React.FC<ExpertLayoutProps> = ({
  children,
  title,
  subtitle,
  backLink = "/expert/dashboard",
  actions,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 pt-32 sm:pt-40 px-4 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-blue-400/5 dark:bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-indigo-400/5 dark:bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <Link 
              href={backLink} 
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all hover:shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Back</span>
            </Link>
            {actions && <div className="flex gap-3">{actions}</div>}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl">{subtitle}</p>}
          </div>
        </header>
        
        {children}
      </div>
    </div>
  );
};
