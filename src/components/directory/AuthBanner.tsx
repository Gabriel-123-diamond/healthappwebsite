'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { PublicExpert } from '@/types/expert';

interface AuthBannerProps {
  privateExpert: PublicExpert | null;
}

export function AuthBanner({ privateExpert }: AuthBannerProps) {
  return (
    <AnimatePresence>
      {privateExpert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mb-8 p-6 ${privateExpert.isMe ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'} border rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-500/5`}
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className={`p-3 ${privateExpert.isMe ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-amber-500 shadow-amber-500/20'} rounded-2xl shadow-lg`}>
              {privateExpert.isMe ? <BadgeCheck className="w-6 h-6 text-white" /> : <Shield className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {privateExpert.isMe ? 'Authenticated as Owner' : 'Protocol Established'}
              </h3>
              <p className={`${privateExpert.isMe ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} text-[10px] font-black uppercase tracking-[0.2em] mt-0.5`}>
                {privateExpert.isMe ? 'You are viewing your own private clinical entry' : 'Private clinical entry unlocked and authenticated'}
              </p>
            </div>
          </div>
          {privateExpert.isMe && (
            <Link 
              href="/expert/dashboard"
              className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              Go to Dashboard
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
