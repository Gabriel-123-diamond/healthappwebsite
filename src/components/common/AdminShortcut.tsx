'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

interface AdminShortcutProps {
  className?: string;
}

export function AdminShortcut({ className = "" }: AdminShortcutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <Link 
        href="/admin/login"
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 text-slate-400 rounded-xl transition-all group border border-transparent hover:border-blue-500/30"
        title="Admin Portal"
      >
        <ShieldAlert size={14} className="group-hover:text-blue-500 transition-colors" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] hidden sm:inline">Admin</span>
      </Link>
    </motion.div>
  );
}
