'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, Server, Cpu, Terminal, ShieldAlert } from 'lucide-react';

export function PerformanceMonitor() {
  const [latency, setLatency] = useState(42);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(20, Math.min(150, prev + (Math.random() * 20 - 10))));
      
      const newLog = `[${new Date().toLocaleTimeString()}] AUTH_VERIFY_NODE_${Math.floor(Math.random()*100)} success.`;
      setLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Real-time Waveform */}
      <div className="lg:col-span-8 bg-[#0B1221] rounded-[48px] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Database size={120} className="text-blue-500" />
        </div>
        
        <div className="relative z-10 flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">DB Latency Engine</h3>
            </div>
            <p className="text-4xl font-black text-white tracking-tighter">{latency.toFixed(1)}<span className="text-blue-500 ml-1 italic">ms</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Status</p>
            <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mt-1">Operational</p>
          </div>
        </div>

        {/* Waveform Visualization */}
        <div className="h-32 flex items-end gap-1 px-2">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: [20, 40 + Math.random() * 60, 20],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.05 
              }}
              className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-sm"
              style={{ minHeight: '4px' }}
            />
          ))}
        </div>
      </div>

      {/* System Metrics Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#0B1221] rounded-[40px] p-8 border border-white/5 shadow-2xl">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Internal Logs</h4>
          <div className="space-y-4">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 items-start group">
                <Terminal size={12} className="text-blue-500 mt-0.5 opacity-50 group-hover:opacity-100" />
                <p className="text-[9px] font-mono text-slate-400 leading-relaxed truncate">{log}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MetricSmall icon={Cpu} label="CPU Load" val="12.4%" color="text-indigo-400" />
          <MetricSmall icon={Server} label="Memory" val="2.1GB" color="text-emerald-400" />
        </div>
      </div>
    </div>
  );
}

function MetricSmall({ icon: Icon, label, val, color }: any) {
  return (
    <div className="bg-[#0B1221] rounded-[32px] p-6 border border-white/5 shadow-xl group hover:border-white/10 transition-all">
      <Icon size={16} className={`${color} mb-3`} />
      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-black text-white uppercase tracking-tight mt-1">{val}</p>
    </div>
  );
}
