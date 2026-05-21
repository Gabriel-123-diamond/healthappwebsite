import React from 'react';
import Link from 'next/link';

interface ActionLinkProps {
  href: string;
  icon: any;
  label: string;
}

export function ActionLink({ href, icon: Icon, label }: ActionLinkProps) {
  return (
    <Link 
      href={href}
      className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:scale-105 transition-all flex flex-col items-center text-center gap-4 group"
    >
      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{label}</span>
    </Link>
  );
}
