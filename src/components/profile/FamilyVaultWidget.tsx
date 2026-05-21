'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, UserPlus, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function FamilyVaultWidget() {
  const members = [
    { id: '1', name: 'Alice (Mother)', records: 12, lastUpdate: '2 days ago', color: 'bg-rose-500' },
    { id: '2', name: 'Bobby (Son)', records: 5, lastUpdate: '1 week ago', color: 'bg-sky-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Family Vault</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Secure Dependent Records</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">
          <UserPlus size={14} /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {members.map((member) => (
          <Link href={`/family/${member.id}`} key={member.id}>
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4 hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-2xl ${member.color} flex items-center justify-center text-white shadow-lg`}>
                  <Users size={20} />
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Last Activity</p>
                  <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">{member.lastUpdate}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{member.name}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                    <FileText size={10} /> {member.records} Records
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[8px] font-black uppercase tracking-widest">Encrypted</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
