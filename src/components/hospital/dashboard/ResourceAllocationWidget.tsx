'use client';

import React from 'react';
import { Plus, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ResourceAllocationWidgetProps {
  resources: Array<{
    id: string;
    label: string;
    available: number;
    total: number;
    color: string;
  }>;
  setResources: (resources: any[]) => void;
  erStatus: 'OPEN' | 'CLOSED';
  setErStatus: (status: 'OPEN' | 'CLOSED') => void;
}

export function ResourceAllocationWidget({
  resources,
  setResources,
  erStatus,
  setErStatus
}: ResourceAllocationWidgetProps) {

  const adjustAvailable = (id: string, amount: number) => {
    const updated = resources.map(res => {
      if (res.id !== id) return res;
      const nextAvailable = Math.max(0, Math.min(res.total, res.available + amount));
      return { ...res, available: nextAvailable };
    });
    setResources(updated);
  };

  const toggleErStatus = () => {
    setErStatus(erStatus === 'OPEN' ? 'CLOSED' : 'OPEN');
  };

  return (
    <div className="bg-[#0B1221]/50 backdrop-blur-xl rounded-[40px] p-8 border border-white/5 space-y-6 shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Resource Allocation</h3>
        <button
          onClick={toggleErStatus}
          className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[8px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 ${
            erStatus === 'OPEN'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 animate-pulse'
          }`}
        >
          {erStatus === 'OPEN' ? (
            <>
              <CheckCircle2 size={10} />
              ER Status: Open
            </>
          ) : (
            <>
              <AlertTriangle size={10} />
              ER Status: Closed
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {resources.map((res) => (
          <div key={res.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-tight">{res.label}</p>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                  Available: <span className="text-white font-black">{res.available}</span> / {res.total}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => adjustAvailable(res.id, -1)}
                  className="w-7 h-7 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg flex items-center justify-center border border-white/5 transition-all active:scale-90"
                >
                  <Minus size={12} />
                </button>
                <button
                  onClick={() => adjustAvailable(res.id, 1)}
                  className="w-7 h-7 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg flex items-center justify-center border border-white/5 transition-all active:scale-90"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
              <div 
                className={`h-full ${res.color} rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]`} 
                style={{ width: `${(res.available / res.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 grid grid-cols-2 gap-3">
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-1">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Oxygen Supply</p>
          <p className="text-sm font-black text-white uppercase tracking-tight">98%</p>
        </div>
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-1">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Staff On Duty</p>
          <p className="text-sm font-black text-white uppercase tracking-tight">24/30</p>
        </div>
      </div>
    </div>
  );
}
