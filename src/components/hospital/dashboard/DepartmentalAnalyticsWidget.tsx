'use client';

import React from 'react';
import { LayoutGrid, TrendingUp, Clock } from 'lucide-react';

export function DepartmentalAnalyticsWidget() {
  const departments = [
    { name: 'Emergency', load: 85, waitTime: '12m', color: 'bg-red-500' },
    { name: 'Cardiology', load: 40, waitTime: '25m', color: 'bg-blue-500' },
    { name: 'Pediatrics', load: 65, waitTime: '15m', color: 'bg-emerald-500' },
    { name: 'Radiology', load: 20, waitTime: '5m', color: 'bg-amber-500' },
  ];

  return (
    <section className="bg-[#0B1221]/50 backdrop-blur-xl rounded-[48px] p-8 border border-white/5 shadow-2xl space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#020617] border border-white/5 rounded-2xl flex items-center justify-center text-slate-500">
            <LayoutGrid size={20} />
          </div>
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
            Departmental Nodes
          </h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-[9px] font-black uppercase tracking-widest">
          <TrendingUp size={10} />
          Real-time
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {departments.map((dept) => (
          <div key={dept.name} className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-4 hover:border-white/10 transition-all">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">{dept.name}</p>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock size={10} />
                <span className="text-[8px] font-black uppercase tracking-widest">{dept.waitTime}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] font-black uppercase tracking-widest text-slate-600">
                <span>Active Load</span>
                <span className="text-white">{dept.load}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${dept.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                  style={{ width: `${dept.load}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
