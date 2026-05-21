'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

interface TierGateProps {
  isLocked: boolean;
  featureName: string;
  children: React.ReactNode;
}

export const TierGate: React.FC<TierGateProps> = ({ isLocked, featureName, children }) => {
  const router = useRouter();

  if (!isLocked) {
    return <>{children}</>;
  }

  const handleGateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/expert/upgrade');
  };

  return (
    <div 
      onClick={handleGateClick}
      className="relative group w-full transition-all duration-300 cursor-pointer"
    >
      {/* Visual Disabled Overlay */}
      <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/20 rounded-[40px] z-20 transition-all duration-300 group-hover:bg-slate-900/20" />
      
      {/* Grayscale Content Wrapper */}
      <div className="filter grayscale opacity-50 blur-[0.5px] pointer-events-none select-none transition-all duration-300 group-hover:opacity-40">
        {children}
      </div>

      {/* Modern Locked Glass Badge */}
      <div className="absolute top-4 right-4 z-30 px-3 py-1.5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-2 transform transition-transform duration-300 group-hover:scale-105">
        <Lock size={12} className="text-blue-600 dark:text-blue-400" />
        <span className="text-[9px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Unlock {featureName}
        </span>
      </div>

      {/* Upgrade CTA Overlay on Hover */}
      <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30 transform scale-95 group-hover:scale-100 transition-all duration-300">
          Upgrade to Access
        </div>
      </div>
    </div>
  );
};
