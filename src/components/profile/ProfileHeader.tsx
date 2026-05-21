'use client';

import { User as UserIcon, Settings, ShieldCheck, Mail, Phone, MapPin, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { UserProfile } from '@/types/user';
import { useTranslations } from 'next-intl';
import { useCountdown } from '@/hooks/useCountdown';
import { useRouter } from '@/i18n/routing';
import React, { useState } from 'react';
import MetadataNode from './MetadataNode';
import AccountDetailsModal from './AccountDetailsModal';

interface ProfileHeaderProps {
  user: User;
  userProfile: UserProfile | null;
  onEdit: () => void;
}

export default function ProfileHeader({ user, userProfile, onEdit }: ProfileHeaderProps) {
  const router = useRouter();
  const t = useTranslations('profile.header');
  const role = userProfile?.role || 'user';
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Scroll Lock
  React.useEffect(() => {
    if (showDetails) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDetails]);

  const timeLeft = useCountdown(
    userProfile?.tier && userProfile.tier !== 'basic' ? userProfile.subscriptionExpiry || null : null
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      {/* Outer Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-[40px] sm:rounded-[48px] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden transition-all duration-500">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="p-6 sm:p-10 lg:p-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            
            {/* Avatar Cluster */}
            <div className="relative shrink-0 self-center lg:self-start">
              <div className="absolute -inset-4 border border-blue-500/20 rounded-[40px] animate-pulse pointer-events-none" />
              <div className="absolute -inset-2 border border-blue-500/10 rounded-[36px] pointer-events-none" />
              
              <div className="w-28 h-28 sm:w-36 lg:w-40 bg-slate-900 dark:bg-black rounded-[32px] lg:rounded-[40px] flex items-center justify-center text-white border border-white/10 shadow-2xl relative overflow-hidden group/avatar">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter relative z-10">
                  {userProfile?.fullName?.[0]?.toUpperCase() || user.email?.[0].toUpperCase() || <UserIcon className="w-12 h-12" />}
                </span>
                
                {/* Scanner Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-1/2 w-full animate-scan pointer-events-none" />
              </div>
              
              {role !== 'user' && (
                <div className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 rounded-2xl border-4 border-white dark:border-slate-900 text-white shadow-xl transform rotate-6">
                  <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 w-full space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-4 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{role} Account</span>
                    </div>

                    {userProfile?.tier && userProfile.tier !== 'basic' && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 dark:bg-white border border-slate-800 dark:border-slate-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white dark:text-slate-900">SETTINGS & OPTIONS</h3>
                      </div>
                    )}
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] uppercase break-words">
                    {userProfile?.fullName || user.displayName || 'My Profile'}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <Activity size={12} className="animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                    </div>
                    {timeLeft && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 rounded-xl">
                        <Clock size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest tabular-nums">
                          {timeLeft.days}D {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => setShowDetails(true)}
                  className="group/btn flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                >
                  <Settings size={14} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                  Account Details
                </button>
              </div>

              {/* Quick Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-8 border-t border-slate-100 dark:border-white/5">
                <MetadataNode 
                  icon={Mail} 
                  label="Email" 
                  value={user.email || 'NO RECORD'} 
                  onClick={() => setShowDetails(true)}
                />
                <MetadataNode 
                  icon={Phone} 
                  label="Phone" 
                  value={userProfile?.phone || 'NO RECORD'} 
                  onClick={() => setShowDetails(true)}
                />
                <MetadataNode 
                  icon={MapPin} 
                  label="Where you are" 
                  value={userProfile?.country ? `${userProfile.city || 'Central'}, ${userProfile.country}` : 'OFFLINE'} 
                  onClick={() => setShowDetails(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AccountDetailsModal 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
        user={user} 
        userProfile={userProfile} 
        onEdit={onEdit} 
        router={router} 
      />
    </motion.div>
  );
}
