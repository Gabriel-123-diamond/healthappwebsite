'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { FileText, Plus, Edit3, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExpertDashboardHeaderProps {
  onCreationAttempt: (e: React.MouseEvent, type: 'article' | 'course') => void;
  verificationStatus?: string;
  role?: string;
}

export const ExpertDashboardHeader: React.FC<ExpertDashboardHeaderProps> = ({ onCreationAttempt, verificationStatus, role }) => {
  const isVerified = verificationStatus === 'verified';
  const isHospital = role === 'hospital';
  const isWellnessPractitioner = role === 'wellness_practitioner';

  return (
    <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">
          {isWellnessPractitioner ? 'Wellness Console' : 'Expert Dashboard'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic uppercase tracking-widest text-[10px]">
          {isHospital ? 'Institutional Management Mode Active' : isWellnessPractitioner ? 'Manage your holistic wisdom, articles, and courses.' : 'Manage your articles, courses, and profile.'}
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        {isHospital && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/hospital/registry"
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-indigo-500/20"
            >
              <Building2 className="w-4 h-4" /> Institutional Center
            </Link>
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            href="/expert/profile/edit"
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Edit3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Edit Profile
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button 
            onClick={(e) => onCreationAttempt(e, 'article')}
            className={`px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm ${!isVerified ? 'grayscale opacity-80 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" /> New Article
          </button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button 
            onClick={(e) => onCreationAttempt(e, 'course')}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-2xl ${!isVerified ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale' : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:scale-[1.02] shadow-blue-500/10'}`}
          >
            <Plus className="w-4 h-4" /> Create Course
          </button>
        </motion.div>
      </div>
    </header>
  );
};
