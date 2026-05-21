'use client';

import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ClinicalProtocolNode = ({ steps }: { steps: string[] }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={16} className="text-emerald-500" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clinical Protocol Node</h3>
      </div>

      <div className="bg-emerald-50/30 dark:bg-emerald-900/5 rounded-[40px] border border-emerald-100 dark:border-emerald-900/20 p-8 sm:p-10">
        <div className="space-y-6">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-6 group"
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-emerald-600 shadow-sm">
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-emerald-500/30 to-transparent my-2" />
                )}
              </div>
              <div className="pb-2">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed group-hover:text-emerald-600 transition-colors">
                  {step}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
