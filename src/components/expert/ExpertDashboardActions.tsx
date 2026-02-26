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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/expert/appointments" className="w-full block text-left p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors text-sm font-bold border border-blue-100 dark:border-blue-800 flex items-center justify-between">
            Manage Appointments
            <Calendar className="w-4 h-4" />
          </Link>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/expert/patients" className="w-full block text-left p-3 rounded-xl bg-purple-50 dark:bg-blue-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-colors text-sm font-bold border border-purple-100 dark:border-purple-800 flex items-center justify-between">
            My Patients
            <Users className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/expert/analytics" className="w-full block text-left p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors text-sm font-bold border border-emerald-100 dark:border-emerald-800 flex items-center justify-between">
            Performance Analytics
            <BarChart2 className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/expert/setup" className="w-full block text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            Update Profile Info
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href={`/directory/${expertId}`} className="w-full block text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            View Public Profile
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
