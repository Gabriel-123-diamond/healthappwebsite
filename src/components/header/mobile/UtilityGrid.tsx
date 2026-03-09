import React from 'react';
import { motion, Variants } from 'framer-motion';
import { LayoutDashboard, User, Calendar } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { isExpertRole, UserProfile } from '@/types/user';

interface UtilityGridProps {
  userProfile: UserProfile | null;
  t: any;
  onClose: () => void;
  itemVariants: Variants;
}

export function UtilityGrid({ userProfile, t, onClose, itemVariants }: UtilityGridProps) {
  return (
    <div className="space-y-6">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Core Tools</p>
      <div className="grid grid-cols-2 gap-4">
        {userProfile && isExpertRole(userProfile.role) ? (
          <motion.div variants={itemVariants}>
            <Link href="/expert/dashboard" onClick={onClose} className="flex flex-col gap-3 p-5 bg-blue-600 dark:bg-blue-500 rounded-[32px] border border-blue-500/30 transition-all active:scale-95 shadow-xl shadow-blue-500/20 group">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-sm">
                <LayoutDashboard size={20} />
              </div>
              <span className="font-black text-white text-[10px] uppercase tracking-[0.2em]">{t('profile.menu.expertDashboard')}</span>
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <Link href="/profile" onClick={onClose} className="flex flex-col gap-3 p-5 bg-slate-50 dark:bg-white/[0.02] rounded-[32px] border border-slate-100 dark:border-white/5 transition-all hover:border-blue-500/30 group">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                <User size={20} />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">Profile</span>
            </Link>
          </motion.div>
        )}
        <motion.div variants={itemVariants}>
          <Link 
            href={userProfile && isExpertRole(userProfile.role) ? "/expert/appointments" : "/appointments"} 
            onClick={onClose} 
            className="flex flex-col gap-3 p-5 bg-slate-50 dark:bg-white/[0.02] rounded-[32px] border border-slate-100 dark:border-white/5 transition-all hover:border-blue-500/30 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Calendar size={20} />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">Appointments</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
