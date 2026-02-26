import React from 'react';
import { ShieldCheck, Star, BadgeCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExpertHeaderProps {
  name: string;
  type: string;
  specialty: string;
  rating: number;
  verified: boolean;
}

export default function ExpertHeader({ name, type, specialty, rating, verified }: ExpertHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 p-8 sm:p-12 text-white border-b border-white/5 transition-all">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-blue-600/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 border border-blue-500/30">
              {type}
            </span>
            {verified && (
              <span className="bg-emerald-500/10 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified Specialist
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-none capitalize">
              {name}
            </h1>
            <p className="text-xl sm:text-2xl text-slate-400 font-medium tracking-tight">
              {specialty}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Accepting Patients</span>
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Expert Insights Level A</span>
             </div>
          </div>
        </div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 p-6 sm:p-8 rounded-[32px] backdrop-blur-md border border-white/10 shadow-2xl flex flex-col items-center justify-center min-w-[160px]"
        >
          <div className="flex items-center gap-2 text-4xl font-black text-white">
            <Star className="w-8 h-8 text-amber-400 fill-current" />
            {rating}
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-3 text-center">120+ Verifications</div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden p-0.5">
             <div className="h-full bg-amber-400 rounded-full w-[95%]" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
