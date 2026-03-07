'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export function RevenueForecast() {
  const data = [
    { label: 'Jan', historical: 400, projected: 450 },
    { label: 'Feb', historical: 300, projected: 380 },
    { label: 'Mar', historical: 600, projected: 700 },
    { label: 'Apr', historical: 800, projected: 950 },
    { label: 'May', historical: 0, projected: 1200 },
    { label: 'Jun', historical: 0, projected: 1400 },
  ];

  const maxValue = Math.max(...data.map(d => Math.max(d.historical, d.projected)));

  return (
    <div className="mt-8 relative p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm overflow-hidden group/chart">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
         <div>
            <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.25em] mb-1">Growth Forecast Node</h4>
            <div className="flex items-center gap-2">
               <TrendingUp className="w-3 h-3 text-emerald-400" />
               <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">+18.4% Est. Alpha</span>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest opacity-60">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-white/30 rounded-full border border-white/20" />
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest opacity-60">Projected</span>
            </div>
         </div>
      </div>

      <div className="flex items-end justify-between h-40 gap-3 relative z-10">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
            <div className="relative w-full flex items-end justify-center gap-1 h-full">
               {/* Historical Bar */}
               {item.historical > 0 && (
                 <motion.div
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: `${(item.historical / maxValue) * 100}%`, opacity: 1 }}
                   transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 }}
                   className="w-full max-w-[12px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-full relative shadow-lg shadow-blue-500/20"
                 >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 scale-75 group-hover/bar:scale-100 bg-white text-blue-900 text-[10px] font-black py-1 px-2 rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-50">
                      {item.historical} PTS
                    </div>
                 </motion.div>
               )}
               {/* Projected Bar */}
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: `${(item.projected / maxValue) * 100}%`, opacity: 1 }}
                 transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 + 0.3 }}
                 className={`w-full max-w-[12px] rounded-full relative border border-white/10 ${
                   item.historical > 0 
                     ? 'bg-white/10 hover:bg-white/20' 
                     : 'bg-gradient-to-t from-emerald-500/20 to-emerald-400/40 border-emerald-500/30'
                 } transition-colors duration-300`}
               >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 scale-75 group-hover/bar:scale-100 bg-emerald-500 text-white text-[10px] font-black py-1 px-2 rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-50">
                    {item.projected} PTS
                  </div>
               </motion.div>
            </div>
            <span className="text-[9px] font-black text-blue-300/40 uppercase tracking-widest group-hover/bar:text-blue-200 transition-colors">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
