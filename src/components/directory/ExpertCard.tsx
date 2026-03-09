'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Stethoscope, Leaf, Building2, Users, BadgeCheck, Shield, Star, MapPin, ChevronRight } from 'lucide-react';
import { PublicExpert } from '@/types/expert';

interface ExpertCardProps {
  expert: PublicExpert;
  t: any; // Translation function
}

export function ExpertCard({ expert, t }: ExpertCardProps) {
  const getIcon = () => {
    switch (expert.type) {
      case 'doctor': return <Stethoscope className="w-5 h-5" />;
      case 'herbal_practitioner': return <Leaf className="w-5 h-5" />;
      case 'hospital': return <Building2 className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const colors = {
    doctor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    herbal_practitioner: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    hospital: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800',
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
      className="group"
    >
      <Link href={`/directory/${expert.id}`} className="block h-full">
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full">
          <div className="flex justify-between items-start mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${typeColor}`}>
              {getIcon()}
            </div>
            <div className="flex flex-col items-end gap-2">
              {expert.isMe && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white border border-blue-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 animate-pulse">
                  <Users className="w-3.5 h-3.5" />
                  This is You
                </div>
              )}
              {expert.isPrivate && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white border border-amber-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                  <Shield className="w-3.5 h-3.5" />
                  Private Result
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
          
          <div className="flex-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-blue-600 transition-colors capitalize">
              {expert.name}
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              {expert.specialty}
            </p>
          </div>
          
          <div className="pt-6 border-t border-slate-50 dark:border-slate-800 mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold truncate max-w-[150px]">{expert.location}</span>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500">
              <ChevronRight className="w-5 h-5 text-white dark:text-slate-900" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
