import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface InstitutionalStatsProps {
  staffCount: number;
  deptCount: number;
}

export const InstitutionalStats: React.FC<InstitutionalStatsProps> = ({ staffCount, deptCount }) => {
  return (
    <div className="bg-slate-900 p-10 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/30 blur-[60px] rounded-full" />
      <div className="relative z-10">
        <ShieldCheck size={32} className="text-indigo-400 mb-6" />
        <h4 className="text-xl font-black uppercase tracking-tight mb-4">Enterprise Logic</h4>
        <p className="text-sm font-medium opacity-60 leading-relaxed mb-8">
          Defining department nodes enables the "Campus" profile view and allows for autonomous clinical routing.
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Staff</span>
            <span className="text-xl font-black">{staffCount}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Departments</span>
            <span className="text-xl font-black">{deptCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
