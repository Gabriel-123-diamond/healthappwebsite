'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export type TriageStatus = 'scheduled' | 'checked_in' | 'in_consultation' | 'pharmacy' | 'discharged';

export interface RegistryAppointment {
  id: string;
  userId: string;
  expertName: string;
  expertId: string;
  date: string;
  time: string;
  status: string;
  triageStatus?: TriageStatus;
  urgency?: 'normal' | 'high' | 'emergency';
}

interface RegistryKanbanViewProps {
  filteredAppointments: RegistryAppointment[];
  columns: { id: TriageStatus; label: string; icon: any; color: string }[];
  handleTriageUpdate: (aptId: string, newStatus: TriageStatus) => void;
}

export function RegistryKanbanView({ filteredAppointments, columns, handleTriageUpdate }: RegistryKanbanViewProps) {
  return (
    <motion.div 
      key="kanban"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
    >
      {columns.map((col) => (
        <div key={col.id} className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm ${col.color}`}>
                <col.icon size={14} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{col.label}</h3>
            </div>
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">
              {filteredAppointments.filter(a => a.triageStatus === col.id).length}
            </span>
          </div>

          <div className="space-y-4 min-h-[500px]">
            {filteredAppointments.filter(a => a.triageStatus === col.id).map((apt) => (
              <motion.div 
                layoutId={apt.id}
                key={apt.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-emerald-500/20 transition-all cursor-pointer group relative overflow-hidden"
              >
                {apt.urgency === 'emergency' && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
                    <User size={18} />
                  </div>
                  <div className="text-right">
                     <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{apt.time}</p>
                     <p className="text-[10px] font-black text-slate-900 dark:text-white">{apt.date}</p>
                  </div>
                </div>
                
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">
                  Node-{apt.userId.substring(0, 6)}
                </h4>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4">
                  {apt.expertName}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                   <div className="flex -space-x-2">
                      {/* Future: Patient Avatar / Priority Tags */}
                   </div>
                   <div className="flex gap-1">
                      {columns.map((targetCol) => (
                        targetCol.id !== col.id && (
                          <button 
                            key={targetCol.id}
                            onClick={() => handleTriageUpdate(apt.id, targetCol.id)}
                            title={`Move to ${targetCol.label}`}
                            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-blue-500 transition-all"
                          >
                            <targetCol.icon size={12} />
                          </button>
                        )
                      ))}
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
