'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, FileText, Star, BookOpen, MessageCircle } from 'lucide-react';
import { PublicExpert } from '@/types/expert';
import ExpertServicesList from '@/components/expert/ExpertServicesList';

interface ExpertProfileViewProps {
  expert: PublicExpert;
}

export default function ExpertProfileView({ expert }: ExpertProfileViewProps) {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* About Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
            <Info size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Clinical Profile</h2>
        </div>
        
        <div className="relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-full" />
          <p className="pl-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {expert.bio || `${expert.name} is a leading specialist in ${expert.specialty} with over 15 years of clinical practice. Their work focuses on integrating precision medical science with evidence-based traditional wisdom to provide holistic patient outcomes.`}
          </p>
        </div>
      </section>

      {/* Verified Expertise Badge */}
      {expert.verificationStatus === 'verified' && (
        <div className="p-8 rounded-[32px] bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20 text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-widest text-xs">Credentialed Expert</h3>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-widest">Network Verified Status</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
            This practitioner has completed Stage 3 Clinical Verification. Their medical license, board certifications, and clinical experience have been manually reviewed by the Ikiké Health Registry.
          </p>
        </div>
      )}

      {/* Services Section */}
      <ExpertServicesList />

      {/* Portfolio / Publications */}
      <section className="space-y-8">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <BookOpen size={14} /> Academic Portfolio
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-all group">
              <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-2">Published Article</p>
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">Integrative Approaches to {expert.specialty}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-2 line-clamp-2">Exploring the synergy between modern diagnostic tools and ancient healing traditions...</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community Contributions */}
      <section className="p-8 rounded-[32px] bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 flex items-start gap-6">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-indigo-600">
          <MessageCircle size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Expert Contributor</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            {expert.name} is an active member of our health intelligence community, providing evidence-based answers and clinical insights to help users navigate complex health challenges.
          </p>
        </div>
      </section>
    </div>
  );
}
