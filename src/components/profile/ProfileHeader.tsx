'use client';

import React from 'react';
import { User as UserIcon, Settings, ShieldCheck, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { UserProfile } from '@/types/user';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

interface ProfileHeaderProps {
  user: User;
  userProfile: UserProfile | null;
  onEdit: () => void;
}

export default function ProfileHeader({ user, userProfile, onEdit }: ProfileHeaderProps) {
  const t = useTranslations('profile.header');
  const role = userProfile?.role || 'user';
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#0B1221] rounded-[32px] shadow-xl border border-slate-100 dark:border-white/5 p-6 sm:p-8 relative group overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white border-4 border-white dark:border-[#0B1221] shadow-lg text-4xl font-black">
            {userProfile?.fullName?.[0]?.toUpperCase() || user.email?.[0].toUpperCase() || <UserIcon className="w-10 h-10" />}
          </div>
          {role !== 'user' && (
            <div className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 rounded-xl border-4 border-white dark:border-[#0B1221] text-white shadow-md">
              <ShieldCheck size={14} strokeWidth={3} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                  {userProfile?.fullName || user.displayName || 'Intelligence Node'}
                </h1>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  role === 'user' 
                    ? 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10' 
                    : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                }`}>
                  {role}
                </span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 flex items-center justify-center sm:justify-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                REGISTRY VERIFIED
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 p-1">
                {['en', 'fr', 'es', 'de', 'zh', 'ar'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                      locale === lang ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-blue-500'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={onEdit}
                className="px-4 py-2 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all active:scale-95 shadow-sm border border-slate-100 dark:border-white/10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
              >
                <Settings className="w-3.5 h-3.5" />
                {t('settings')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-slate-100/50 dark:border-white/5">
              <Mail size={14} className="shrink-0" />
              <span className="text-xs font-bold truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-slate-100/50 dark:border-white/5">
              <Phone size={14} className="shrink-0" />
              <span className="text-xs font-bold truncate">{userProfile?.phone || 'No phone record'}</span>
            </div>
            {userProfile?.country && (
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-slate-100/50 dark:border-white/5">
                <MapPin size={14} className="shrink-0" />
                <span className="text-xs font-bold truncate">{userProfile.city}, {userProfile.country}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
