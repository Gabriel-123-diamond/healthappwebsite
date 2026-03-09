import React from 'react';
import { Activity } from 'lucide-react';

export const PredictiveAnalytics: React.FC = () => {
  return (
    <div className="p-1 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[48px]">
      <div className="bg-white dark:bg-slate-900 rounded-[46px] p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Activity className="w-32 h-32 text-indigo-500" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-500/20">AI Intelligence Node</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Predictive Patient Analytics</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">AI-driven projections based on your current clinical performance.</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div className="text-right px-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</p>
                  <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">98.4%</p>
               </div>
               <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
               <div className="text-right px-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cycle</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">Q4-24</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { label: 'Projected Growth', value: '+24%', desc: 'Est. patient inflow increase', color: 'text-emerald-500' },
              { label: 'Retention Score', value: '8.9/10', desc: 'AI-calculated patient loyalty', color: 'text-blue-500' },
              { label: 'Market Demand', value: 'High', desc: 'Category: Chronic Care', color: 'text-purple-500' },
            ].map((stat, i) => (
              <div key={i} className="space-y-2 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/30 transition-all group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{stat.label}</p>
                <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
