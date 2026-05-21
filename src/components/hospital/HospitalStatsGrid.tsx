import React from 'react';
import { Users, ClipboardList, ShieldCheck, TrendingUp } from 'lucide-react';

interface HospitalStatsGridProps {
  t: any;
  staffCount: number;
  appointmentsCount: number;
  isVerified: boolean;
}

export function HospitalStatsGrid({ t, staffCount, appointmentsCount, isVerified }: HospitalStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        label={t('totalStaff')} 
        value={staffCount.toString()} 
        icon={Users} 
        color="blue" 
        trend="+2 this month"
      />
      <StatCard 
        label={t('registrySize')} 
        value={appointmentsCount.toString()} 
        icon={ClipboardList} 
        color="emerald" 
        trend="+12 this week"
      />
      <StatCard 
        label={t('verification')} 
        value={isVerified ? "Verified" : "Pending"} 
        icon={ShieldCheck} 
        color="amber" 
      />
      <StatCard 
        label={t('growthScore')} 
        value="8.4" 
        icon={TrendingUp} 
        color="indigo" 
        trend="Top 10%"
      />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, trend }: any) {
  const colorMap: any = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  };

  return (
    <div className="bg-[#0B1221]/50 backdrop-blur-xl p-8 rounded-[40px] border border-white/5 shadow-2xl space-y-6 group hover:border-white/10 transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorMap[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-4xl font-black text-white uppercase tracking-tighter group-hover:scale-105 transition-transform origin-left">{value}</h3>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">{label}</p>
      </div>
      {trend && (
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-fit">
          <TrendingUp size={10} className="text-emerald-400" />
          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">{trend}</span>
        </div>
      )}
    </div>
  );
}
