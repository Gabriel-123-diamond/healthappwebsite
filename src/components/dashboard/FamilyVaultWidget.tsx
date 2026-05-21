'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Lock, ChevronRight, UserPlus } from 'lucide-react';

export function FamilyVaultWidget() {
  const dependents = [
    { name: 'Maria (Mother)', records: 12 },
    { name: 'Leo (Son)', records: 5 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <Shield size={14} className="text-indigo-600" /> Family Vault
        </h3>
        <Lock size={12} className="text-slate-400" />
      </div>

      <div className="space-y-4">
        {dependents.map((dep) => (
          <div key={dep.name} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                <Users size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{dep.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{dep.records} Records Secure</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
          </div>
        ))}
      </div>

      <button className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 hover:border-indigo-500/50 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
        <UserPlus size={14} /> Add Dependent
      </button>
    </div>
  );
}
