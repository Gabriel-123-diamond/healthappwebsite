'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FilePlus, History, Pill, ArrowRight } from 'lucide-react';
import { EPrescribingModal } from '../EPrescribingModal';

export function EPrescribingWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const recentPrescriptions = [
    { id: '1', patient: 'John Doe', med: 'Amoxicillin 500mg', date: '2h ago' },
    { id: '2', patient: 'Sarah Smith', med: 'Lisinopril 10mg', date: '5h ago' },
  ];

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <Pill size={14} className="text-blue-600" /> E-Prescribing
          </h3>
          <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1">
            <History size={12} /> View History
          </button>
        </div>

        <div className="space-y-4">
          {recentPrescriptions.map((pres) => (
            <div key={pres.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                  <Pill size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{pres.med}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{pres.patient}</p>
                </div>
              </div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{pres.date}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10"
        >
          <FilePlus size={14} /> New Prescription <ArrowRight size={14} />
        </button>
      </div>

      <EPrescribingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
