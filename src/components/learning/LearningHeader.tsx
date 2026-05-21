'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Sparkles, BookOpen, Clock, Users } from 'lucide-react';

export function BackgroundGlow() {
  return (
    <>
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-blue-400 dark:bg-blue-600 blur-[120px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-indigo-400 dark:bg-indigo-600 blur-[120px] rounded-full pointer-events-none" 
      />
    </>
  );
}

export function NavigationHeader({ onBack }: { onBack: () => void }) {
  return (
    <motion.button 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onBack} 
      className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
      Go Back
    </motion.button>
  );
}

export function PageHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 text-center space-y-4"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
        <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Protocol Directory</span>
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
        {subtitle}
      </p>
    </motion.div>
  );
}

export function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
          : 'text-slate-500 hover:text-blue-600 dark:hover:text-blue-400'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export function LearningStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
      {[
        { label: 'Protocols', value: '48+', icon: BookOpen, color: 'text-blue-500' },
        { label: 'Total Learners', value: '1.2k', icon: Users, color: 'text-emerald-500' },
        { label: 'Study Hours', value: '450+', icon: Clock, color: 'text-purple-500' },
        { label: 'Specialties', value: '12', icon: Sparkles, color: 'text-amber-500' },
      ].map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3"
        >
          <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
            <stat.icon size={16} />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
