'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface IntelligenceDiscoveryProps {
  t: any;
  courses: Array<{ title: string; progress: number; color: string }>;
}

export function IntelligenceDiscovery({ t, courses }: IntelligenceDiscoveryProps) {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-3 px-4">
        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">Your Learning</span>
        <div className="h-px flex-1 bg-gradient-to-r from-blue-600/20 to-transparent" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="group relative"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
        
        <div className="relative bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] mix-blend-overlay" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />
          
          <div className="p-8 sm:p-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform duration-500">
                    <BookOpen size={28} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg border-4 border-white dark:border-slate-900 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-2">
                    {t('intelligence')}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                      Active Course
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {courses.length} Lessons Completed
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/learning" className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 dark:hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                {t('explore')}
                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="relative p-6 sm:p-8 rounded-[32px] bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-all duration-500 group/item overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-2xl opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Course Module {i + 1}</span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight max-w-[80%]">
                        {course.title}
                      </h4>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 group-hover/item:text-blue-500 transition-colors">
                      <Sparkles size={16} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Progress</span>
                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                          Learning in Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                          {course.progress}%
                        </span>
                      </div>
                    </div>

                    <div className="relative h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300/30 dark:border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 2, delay: 0.5 + (i * 0.2), ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full ${course.color} rounded-full relative`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[4px] opacity-50" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
