'use client';

import React from 'react';
import { Users, ChevronRight, BadgeCheck, MapPin, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { RestrictedAccessModal } from '../RestrictedAccessModal';

export const VerifiedExperts = ({ experts, total, query, isLoggedOut = false }: { experts: any[], total: number, query?: string, isLoggedOut?: boolean }) => {
  const [showModal, setShowModal] = React.useState(false);
  if (!experts || experts.length === 0) return null;

  const handleExpertClick = (e: React.MouseEvent) => {
    if (isLoggedOut) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            Top Professional Matches ({total})
          </h3>
          {query && total > 3 && (
            <Link href={isLoggedOut ? "#" : `/directory?query=${encodeURIComponent(query)}`} onClick={handleExpertClick} className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors flex items-center gap-1">
              {isLoggedOut ? "Unlock All Experts" : "View Directory"} <ChevronRight size={12} />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {experts.slice(0, 4).map((expert, idx) => {
            const content = (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-all relative">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h4 className="font-black text-slate-900 dark:text-white text-sm sm:text-base truncate transition-all capitalize group-hover:text-blue-600">
                      {expert.name}
                    </h4>
                    <BadgeCheck size={14} className="text-emerald-500 shrink-0" />
                  </div>
                  
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate mb-2">
                    {expert.specialty}
                  </p>

                  <div className="flex items-center gap-1 text-slate-400">
                    <MapPin size={10} />
                    <span className="text-[10px] font-bold truncate capitalize">{expert.location}</span>
                  </div>
                </div>
              </div>
            );

            return (
              <motion.div 
                key={expert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="group relative p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:border-blue-500/30"
              >
                <Link href={isLoggedOut ? "#" : `/directory/${expert.id}`} onClick={handleExpertClick}>
                  {content}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
      <RestrictedAccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
