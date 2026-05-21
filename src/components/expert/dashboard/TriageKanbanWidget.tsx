'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, User, AlertCircle, CheckCircle2, MoreHorizontal } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  waitingTime: string;
  urgency: 'critical' | 'urgent' | 'stable' | 'routine';
}

const patients: Patient[] = [
  { id: '1', name: 'John Doe', age: 45, gender: 'M', condition: 'Chest Pain', waitingTime: '12m', urgency: 'critical' },
  { id: '2', name: 'Sarah Smith', age: 29, gender: 'F', condition: 'High Fever', waitingTime: '45m', urgency: 'urgent' },
  { id: '3', name: 'Mike Ross', age: 52, gender: 'M', condition: 'Routine Checkup', waitingTime: '1h', urgency: 'routine' },
  { id: '4', name: 'Emma Wilson', age: 34, gender: 'F', condition: 'Stable BP', waitingTime: '30m', urgency: 'stable' },
];

export function TriageKanbanWidget() {
  const columns = [
    { id: 'critical', label: 'Critical', color: 'bg-red-500', icon: <AlertCircle className="text-red-500" size={16} /> },
    { id: 'urgent', label: 'Urgent', color: 'bg-amber-500', icon: <Clock className="text-amber-500" size={16} /> },
    { id: 'stable', label: 'Stable', color: 'bg-emerald-500', icon: <CheckCircle2 className="text-emerald-500" size={16} /> },
    { id: 'routine', label: 'Routine', color: 'bg-blue-500', icon: <Activity className="text-blue-500" size={16} /> },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Smart Triage Kanban</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AI-Assessed Patient Priority Board</p>
        </div>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <MoreHorizontal size={20} className="text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => (
          <div key={col.id} className="space-y-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
              {col.icon}
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{col.label}</span>
              <span className="ml-auto text-[10px] font-black bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-lg text-slate-500">
                {patients.filter(p => p.urgency === col.id).length}
              </span>
            </div>

            <div className="space-y-3">
              {patients.filter(p => p.urgency === col.id).map((patient) => (
                <motion.div
                  key={patient.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                        <User size={16} />
                      </div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{patient.waitingTime}</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{patient.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{patient.age}Y • {patient.gender}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-50 dark:border-white/5">
                      <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1">
                        <Activity size={10} /> {patient.condition}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
