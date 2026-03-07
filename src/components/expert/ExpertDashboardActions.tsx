'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { Calendar, Users, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExpertDashboardActionsProps {
  expertId?: string;
}

export const ExpertDashboardActions: React.FC<ExpertDashboardActionsProps> = ({ expertId }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
          <BarChart2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Quick Actions</h3>
      </div>
      
      <div className="space-y-4">
        {[
          { href: "/expert/appointments", label: "Manage Appointments", icon: Calendar, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/5 hover:bg-blue-500/10", border: "border-blue-500/10 hover:border-blue-500/30" },
          { href: "/expert/patients", label: "Patient Directory", icon: Users, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/5 hover:bg-purple-500/10", border: "border-purple-500/10 hover:border-purple-500/30" },
          { href: "/expert/analytics", label: "Clinical Analytics", icon: BarChart2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/5 hover:bg-emerald-500/10", border: "border-emerald-500/10 hover:border-emerald-500/30" },
        ].map((item) => (
          <motion.div key={item.label} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
            <Link 
              href={item.href} 
              className={`w-full flex items-center justify-between p-4 rounded-2xl ${item.bg} border ${item.border} transition-all group`}
            >
              <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.label}</span>
              <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
            </Link>
          </motion.div>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-50 dark:border-slate-800 space-y-3">
          <Link href="/expert/setup" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400 transition-colors px-2">
            Update Professional Profile
          </Link>
          <Link href={`/directory/${expertId}`} className="block text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400 transition-colors px-2">
            Preview Public Identity
          </Link>
        </div>
      </div>
    </div>
  );
};
