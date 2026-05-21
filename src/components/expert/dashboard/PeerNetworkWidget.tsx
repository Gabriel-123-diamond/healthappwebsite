'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Shield, ArrowRight } from 'lucide-react';

export function PeerNetworkWidget() {
  const activeSpecialists = [
    { id: '1', name: 'Dr. Aris', specialty: 'Cardiology', online: true },
    { id: '2', name: 'Dr. Chen', specialty: 'Neurology', online: false },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <MessageSquare size={14} className="text-indigo-600" /> Peer Network
        </h3>
        <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
          <Shield size={10} /> Secure
        </span>
      </div>

      <div className="space-y-4">
        {activeSpecialists.map((spec) => (
          <div key={spec.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                  <Users size={18} />
                </div>
                {spec.online && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{spec.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{spec.specialty}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-indigo-600">
              <MessageSquare size={16} />
            </button>
          </div>
        ))}
      </div>

      <button className="w-full py-4 border-2 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
        Consult Specialist <ArrowRight size={14} />
      </button>
    </div>
  );
}
