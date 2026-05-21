'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Info, ShoppingBag, Video, MessageCircle, Star, ShieldCheck } from 'lucide-react';
import { PublicExpert } from '@/types/expert';
import ExpertServicesList from '@/components/expert/ExpertServicesList';

interface PractitionerProfileViewProps {
  practitioner: PublicExpert;
}

export default function PractitionerProfileView({ practitioner }: PractitionerProfileViewProps) {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section / Philosophy */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600">
            <Leaf size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Healing Philosophy</h2>
        </div>
        
        <div className="relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-full" />
          <p className="pl-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {practitioner.bio || `${practitioner.name} is a dedicated wellness practitioner specializing in ${practitioner.specialty}. Their approach centers on restoring the body's natural balance through evidence-based herbal protocols and traditional wisdom.`}
          </p>
        </div>
      </section>

      {/* Verified Practitioner Badge */}
      {practitioner.verificationStatus === 'verified' && (
        <div className="p-8 rounded-[32px] bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-widest text-xs">Verified Practitioner</h3>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest">Network Authenticated</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
            This practitioner's certifications, practice history, and traditional lineage have been verified by the Ikiké Wellness Board.
          </p>
        </div>
      )}

      {/* Services & Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <ShoppingBag size={14} /> Wellness Services
          </h3>
          <ExpertServicesList />
        </div>
        <div className="space-y-8">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <Leaf size={14} /> Herbal Dispensary
          </h3>
          <div className="space-y-4">
            {practitioner.herbalProducts?.length ? practitioner.herbalProducts.map((product: string, i: number) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                    <Leaf size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{product}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Natural Remedy</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-slate-900 dark:text-white">$25.00</p>
                </div>
              </div>
            )) : (
              <div className="p-10 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[32px] text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No products listed</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Testimonials or Philosophy Quote */}
      <section className="p-10 bg-slate-900 dark:bg-black rounded-[48px] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Leaf size={120} className="rotate-12" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-2xl font-medium leading-relaxed italic opacity-90 mb-6">
            "True health is not merely the absence of disease, but a state of complete physical, mental, and social well-being."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              <Star size={20} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest">{practitioner.name}</p>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Master Practitioner</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
