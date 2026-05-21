import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { User as AuthUser } from 'firebase/auth';
import { UserProfile } from '@/types/user';

interface UserProfileHeaderProps {
  user: AuthUser;
  userProfile: UserProfile | null;
  t: any;
  onClose: () => void;
  itemVariants: Variants;
}

export const UserProfileHeader = ({ user, userProfile, t, onClose, itemVariants }: UserProfileHeaderProps) => {
  return (
    <motion.div variants={itemVariants} className="p-6 bg-slate-50 dark:bg-white/[0.03] rounded-[32px] border border-slate-100 dark:border-white/5 flex items-center gap-4">
      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white font-black text-xl">
        {user.email?.[0].toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t('header.clinicalIdentity')}</p>
          {(userProfile?.tier === 'vip1' || userProfile?.tier === 'vip2' || userProfile?.tier === 'premium') && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20">
              {userProfile.tier === 'vip1' ? 'PLUS' : 'PREMIUM'}
            </span>
          )}
        </div>
        <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{user.email}</p>
      </div>
      <Link href="/profile" onClick={onClose} className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 border border-slate-100 dark:border-white/10 shadow-sm active:scale-95 transition-all">
        <ChevronRight size={18} />
      </Link>
    </motion.div>
  );
};
