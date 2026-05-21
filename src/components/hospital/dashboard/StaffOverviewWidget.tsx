'use client';

import React from 'react';
import { ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

interface StaffOverviewWidgetProps {
  t: any;
  staff: any[];
}

export function StaffOverviewWidget({ t, staff }: StaffOverviewWidgetProps) {
  return (
    <aside className="space-y-8">
      {/* Clinical Growth / Promotion Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[40px] p-8 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] relative overflow-hidden group">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Clinical Growth</h3>
          </div>
          <p className="text-indigo-100 text-xs font-bold leading-relaxed opacity-80">
            Boost your institutional node and specialists within the global discovery engine.
          </p>
          <Link 
            href="/hospital/promote"
            className="mt-4 w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl"
          >
            Boost Profile <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
      </div>

      {/* Staff Snapshot Card */}
      <div className="bg-[#0B1221]/50 backdrop-blur-xl rounded-[40px] p-8 border border-white/5 space-y-8 shadow-2xl">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Staff Snapshot</h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <div className="w-1 h-1 bg-emerald-500 rounded-full" />
            <span className="text-[7px] font-black text-emerald-400 uppercase tracking-widest">{staff.length} Active</span>
          </div>
        </div>
        <div className="space-y-4">
          {staff.length === 0 ? (
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest text-center py-4 italic">No staff nodes detected</p>
          ) : (
            staff.slice(0, 4).map((member) => (
              <div key={member.uid} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#020617] rounded-xl flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
                    <User size={14} />
                  </div>
                  <p className="text-[10px] font-black text-white uppercase tracking-tight">
                    {member.fullName}
                  </p>
                </div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-[#020617] px-2 py-1 rounded-lg border border-white/5">
                  {member.role}
                </span>
              </div>
            ))
          )}
          <Link 
            href="/hospital/staff" 
            className="block text-center text-[9px] font-black text-blue-400 hover:text-blue-300 hover:scale-105 transition-all uppercase tracking-[0.2em] pt-4"
          >
            Manage All Staff Nodes
          </Link>
        </div>
      </div>
    </aside>
  );
}
