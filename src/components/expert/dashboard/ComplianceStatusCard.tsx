import React from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';

export const ComplianceStatusCard: React.FC = () => {
  return (
    <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
       <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Compliance Status</h4>
       </div>
       <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider">HIPAA Alignment</span>
            <span className="text-emerald-500 font-black flex items-center gap-1"><CheckCircle className="w-3 h-3" /> ACTIVE</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
          </div>
          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-slate-500 font-bold uppercase tracking-wider">Security Audit</span>
            <span className="text-slate-900 dark:text-white font-black">L-3 PASS</span>
          </div>
       </div>
    </div>
  );
};
