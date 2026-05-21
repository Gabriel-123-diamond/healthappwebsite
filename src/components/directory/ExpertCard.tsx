'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Stethoscope, Leaf, Building2, Users, BadgeCheck, Shield, Star, MapPin, ChevronRight, Activity } from 'lucide-react';
import { PublicExpert } from '@/types/expert';

interface ExpertCardProps {
  expert: PublicExpert;
  t: any; // Translation function
}

export function ExpertCard({ expert, t }: ExpertCardProps) {
  const isHospital = expert.type === 'hospital';

  const getIcon = () => {
    switch (expert.type) {
      case 'doctor': return <Stethoscope className="w-5 h-5" />;
      case 'wellness_practitioner': return <Leaf className="w-5 h-5" />;
      case 'hospital': return <Building2 className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const colors = {
    doctor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    wellness_practitioner: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    hospital: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800',
    other: 'text-slate-600 bg-slate-50 dark:bg-slate-900/20 dark:text-slate-400 border-slate-100 dark:border-slate-800',
  };

  const typeColor = colors[expert.type as keyof typeof colors] || colors.other;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className={`group ${isHospital ? 'md:col-span-2' : ''}`}
    >
      <Link href={`/directory/${expert.id}`} className="block h-full">
        <div className={`bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full relative overflow-hidden ${isHospital ? 'border-l-4 border-l-indigo-600' : ''}`}>
          {isHospital && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -mr-16 -mt-16 pointer-events-none" />
          )}

          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${typeColor}`}>
                {getIcon()}
              </div>
              {isHospital && (
                <div className="hidden sm:block">
                   <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Enterprise Node</p>
                   <h4 className="text-[12px] font-black uppercase tracking-tight text-slate-900 dark:text-white">Authorized Facility</h4>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              {expert.isMe && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white border border-blue-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 animate-pulse">
                  <Users className="w-3.5 h-3.5" />
                  This is You
                </div>
              )}
              {expert.verificationStatus === 'verified' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 text-[10px] font-black uppercase tracking-widest">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {t('verified')}
                </div>
              )}
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg border border-amber-100 dark:border-amber-800">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-black">{expert.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative z-10">
            <h3 className={`font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-blue-600 transition-colors capitalize ${isHospital ? 'text-3xl' : 'text-2xl'}`}>
              {expert.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {expert.specialty}
              </p>
              {isHospital && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Multi-Specialty Campus</span>
                </>
              )}
            </div>

            {isHospital && expert.bio && (
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 leading-relaxed">
                {expert.bio}
              </p>
            )}
          </div>
          
          <div className="pt-6 border-t border-slate-50 dark:border-slate-800 mt-auto flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold truncate max-w-[150px]">{expert.location}</span>
              </div>

              {isHospital && (
                <div className="hidden sm:flex items-center gap-2 text-slate-400">
                  <Activity size={14} className="text-indigo-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Triage</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Access Protocol</span>
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
