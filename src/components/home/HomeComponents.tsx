import React from 'react';
import { motion } from 'framer-motion';

export function BentoCard({ title, description, icon, className, delay }: { title: string, description: string, icon: React.ReactNode, className?: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`p-8 sm:p-10 rounded-[40px] border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col justify-between ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-tight">{title}</h3>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export function StatMetric({ value, label, delay, color }: { value: string, label: string, delay: number, color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-[40px] border border-white/10 text-center space-y-3 hover:bg-white/10 transition-all duration-500 group"
    >
      <div className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter drop-shadow-sm transition-transform duration-500 group-hover:scale-110 ${color}`}>{value}</div>
      <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">{label}</div>
    </motion.div>
  );
}
