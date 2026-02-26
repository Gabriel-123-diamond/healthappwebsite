'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ExpertStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

export default function ExpertStatCard({ icon, label, value, color }: ExpertStatCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 group"
    >
      <div className="flex flex-col gap-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-inner ${color}`}>
          {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{label}</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{value}</h3>
        </div>
      </div>
    </motion.div>
  );
}
