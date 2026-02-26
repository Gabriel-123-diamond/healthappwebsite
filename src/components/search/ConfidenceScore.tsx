import React from 'react';
import { Activity, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const ConfidenceScore = ({ score, explanation }: { score: number, explanation?: string }) => (
  <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${score > 90 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
        <Activity className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900 dark:text-white">AI Confidence Score</span>
          <span className={`text-sm font-black ${score > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {score}%
          </span>
        </div>
        {explanation && (
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
            <Info className="w-3 h-3" /> {explanation}
          </p>
        )}
      </div>
    </div>
    <div className="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        className={`h-full ${score > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
      />
    </div>
  </div>
);
