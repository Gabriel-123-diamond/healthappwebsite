'use client';

import React from 'react';
import { Shield, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminHeaderProps {
  onLogout: () => void;
  isSuper: boolean;
}

export function AdminHeader({ onLogout, isSuper }: AdminHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
              IKIKE HQ <span className="text-blue-600 ml-1">ADMIN</span>
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {isSuper ? 'Super-User Access' : 'Standard Intelligence'}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="group flex items-center gap-3 px-5 py-2.5 bg-slate-50 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all border border-slate-100 dark:border-white/5"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-red-500 transition-colors">
            Terminate Session
          </span>
          <div className="p-1.5 bg-white dark:bg-slate-800 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all">
            <LogOut size={14} />
          </div>
        </button>
      </div>
    </header>
  );
}
