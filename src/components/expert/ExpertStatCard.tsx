'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ExpertStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

export default function ExpertStatCard({ icon, label, value, color }: ExpertStatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</div>
    </motion.div>
  );
}
