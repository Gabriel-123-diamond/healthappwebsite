import React from 'react';
import { Cpu, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuthBackground = () => (
  <>
    {/* High-Tech Background Grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
    
    {/* Dynamic Background Elements */}
    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none animate-pulse" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
  </>
);

export const AuthMetadataTags = () => (
  <div className="flex justify-between items-center mb-4 px-6">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[8px] font-black text-blue-600 dark:text-blue-400 tracking-tighter uppercase">
        <Cpu size={10} /> Registry v1.0
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[8px] font-black text-amber-600 dark:text-amber-400 tracking-tighter uppercase">
        <Zap size={10} /> New Identity
      </div>
    </div>
    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Node-Genesis-Protocol</span>
  </div>
);

export const AuthScanline = () => (
  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-20 dark:opacity-40" />
);
