'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Clock, Activity, ArrowRight, FileSearch } from 'lucide-react';
import { useExpertDashboard } from '@/context/ExpertDashboardContext';

export function PatientQueue() {
  const { state, dispatch } = useExpertDashboard();
  const { queue } = state;

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Live Triage Queue</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Real-time patient monitoring</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {queue.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-700">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Queue is currently empty</p>
          </div>
        ) : (
          queue.map((patient, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={patient.id}
              className="group relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-100 dark:border-white/5 p-6 rounded-[32px] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all overflow-hidden"
            >
              {/* Subtle Progress Bar for Waiting Time */}
              <div className="absolute bottom-0 left-0 h-1 bg-indigo-500/20 w-full overflow-hidden">
                <motion.div 
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                   className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform shadow-inner">
                    <User className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{patient.name}</h4>
                      <span className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[8px] font-black rounded-full uppercase tracking-[0.1em]">
                        {patient.age}Y • {patient.gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-bold uppercase tracking-tight">{patient.condition}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-black uppercase tracking-tight">{patient.waitingTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch({ type: 'REVIEW_CHART', payload: patient.id })}
                    disabled={patient.status === 'reviewed'}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      patient.status === 'reviewed'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <FileSearch className="w-4 h-4" />
                    Review Chart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch({ type: 'ADMIT_PATIENT', payload: patient.id })}
                    disabled={patient.status === 'admitted'}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                      patient.status === 'admitted'
                        ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-500 cursor-not-allowed border border-emerald-500/20'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/25'
                    }`}
                  >
                    {patient.status === 'admitted' ? 'Admitted' : (
                      <>
                        Admit <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
