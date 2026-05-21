'use client';

import React from 'react';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Observation {
  point: string;
  evidence: string;
  grade: 'A' | 'B' | 'C' | 'D';
  confidence: number;
}

export const ClinicalObservationsNode = ({ observations }: { observations: Observation[] }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-blue-600" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clinical Observations</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {observations.map((obs, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                  obs.grade === 'A' ? 'bg-emerald-100 text-emerald-600' :
                  obs.grade === 'B' ? 'bg-blue-100 text-blue-600' :
                  obs.grade === 'C' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {obs.grade}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Evidence Grade</span>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{obs.confidence}% Confidence</div>
                <div className="w-24 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${obs.confidence}%` }}
                    className={`h-full ${obs.confidence > 80 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  />
                </div>
              </div>
            </div>

            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{obs.point}</h4>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-2 border-slate-200 dark:border-white/10 pl-4">
              {obs.evidence}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
