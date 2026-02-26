'use client';

import React from 'react';
import { User as UserIcon, Settings, ShieldCheck, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';

interface ProfileHeaderProps {
  user: User;
  userProfile?: any;
  onEdit: () => void;
}

export default function ProfileHeader({ user, userProfile, onEdit }: ProfileHeaderProps) {
  const role = userProfile?.role || 'user';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-[48px] shadow-3xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 p-8 sm:p-12 relative group overflow-hidden"
    >
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none" />

      <button 
        onClick={onEdit}
        className="absolute top-8 right-8 p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-90 shadow-sm"
        title="Account Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] flex items-center justify-center text-white mx-auto border-4 border-white dark:border-slate-800 shadow-2xl shadow-blue-500/30 text-4xl sm:text-5xl font-black">
            {user.email?.[0].toUpperCase() || <UserIcon className="w-12 h-12" />}
          </div>
          {role !== 'user' && (
            <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-xl border-4 border-white dark:border-slate-900 text-white shadow-lg">
              <ShieldCheck size={16} strokeWidth={3} />
            </div>
          )}
        </div>

        <div className="space-y-4 text-center md:text-left flex-1 min-w-0">
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                {userProfile?.fullName || user.displayName || 'Clinical Identity'}
              </h1>
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                role === 'user' 
                  ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700' 
                  : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800'
              }`}>
                {role} account
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Ikiké Health Registry Verified</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
            <div className="flex items-center justify-center md:justify-start gap-3 text-slate-500 dark:text-slate-400 min-w-0">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <Mail size={14} />
              </div>
              <span className="text-xs font-bold truncate">{user.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3 text-slate-500 dark:text-slate-400 min-w-0">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <Phone size={14} />
              </div>
              <span className="text-xs font-bold truncate">{userProfile?.phone || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
