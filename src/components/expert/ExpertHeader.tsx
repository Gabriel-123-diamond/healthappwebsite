'use client';

import React from 'react';
import { ShieldCheck, Star, BadgeCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ExpertHeaderProps {
  name: string;
  type: string;
  specialty: string;
  rating: number;
  verified: boolean;
  imageUrl?: string;
}

export default function ExpertHeader({ name, type, specialty, rating, verified, imageUrl }: ExpertHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 p-8 sm:p-12 text-white border-b border-white/5 transition-all">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* Avatar/Image */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-[32px] overflow-hidden border-2 border-white/10 bg-slate-800">
              {imageUrl ? (
                <Image src={imageUrl} alt={name} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-600">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {verified && (
              <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-2xl shadow-lg border-4 border-slate-900">
                <BadgeCheck className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-blue-600 dark:bg-blue-500/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 border border-blue-500/30">
                {type}
              </span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-tight capitalize">
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
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-3 text-center">Clinical Authority</div>
        </motion.div>
      </div>
    </div>
  );
}
