import React from 'react';

interface StatCardProps {
  icon: React.ReactElement;
  label: string;
  value: string;
  color: string;
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-4 ${color} rounded-2xl`}>
          {React.cloneElement(icon, { size: 24 } as any)}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{label}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
}
