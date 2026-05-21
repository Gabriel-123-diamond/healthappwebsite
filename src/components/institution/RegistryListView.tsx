'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, ChevronRight } from 'lucide-react';
import { RegistryAppointment, TriageStatus } from './RegistryKanbanView';

interface RegistryListViewProps {
  filteredAppointments: RegistryAppointment[];
  columns: { id: TriageStatus; label: string; icon: any; color: string }[];
}

export function RegistryListView({ filteredAppointments, columns }: RegistryListViewProps) {
  return (
    <motion.div 
      key="list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-xl"
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
            <th className="p-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Patient Node</th>
            <th className="p-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Specialist</th>
            <th className="p-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Temporal Node</th>
            <th className="p-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Flow Status</th>
            <th className="p-8"></th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((apt) => (
            <tr key={apt.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors border-b border-slate-50 dark:border-white/5 last:border-none">
              <td className="p-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">Node-{apt.userId.substring(0, 6)}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Link</p>
                  </div>
                </div>
              </td>
              <td className="p-8">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{apt.expertName}</p>
              </td>
              <td className="p-8">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Calendar size={14} className="text-emerald-500" />
                  {apt.date} • {apt.time}
                </div>
              </td>
              <td className="p-8">
                <div className="flex items-center gap-2">
                   {columns.find(c => c.id === apt.triageStatus)?.icon && 
                    React.createElement(columns.find(c => c.id === apt.triageStatus)!.icon, { size: 14, className: columns.find(c => c.id === apt.triageStatus)!.color })
                   }
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                      {apt.triageStatus?.replace('_', ' ')}
                   </span>
                </div>
              </td>
              <td className="p-8 text-right">
                <button className="p-2 rounded-xl text-slate-300 hover:text-blue-600 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
