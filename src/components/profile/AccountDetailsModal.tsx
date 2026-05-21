'use client';

import React from 'react';
import { Mail, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'firebase/auth';
import { UserProfile } from '@/types/user';
import AccountAge from './AccountAge';
import { Fingerprint, Phone, MapPin, Calendar, Award, Shield, Activity, Zap, Settings } from 'lucide-react';

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  userProfile: UserProfile | null;
  onEdit: () => void;
  router: any;
}

export default function AccountDetailsModal({ isOpen, onClose, user, userProfile, onEdit, router }: AccountDetailsModalProps) {
  const formatDateWithTime = (dateStr: string | undefined | null) => {
    if (!dateStr) return 'UNKNOWN';
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  };

  const accountDetails = [
    { icon: Fingerprint, label: "Account ID", value: user.uid, category: "Private Info" },
    { icon: Mail, label: "Email Address", value: user.email || 'NO RECORD', category: "Contact" },
    { icon: Phone, label: "Phone Number", value: userProfile?.phone || 'NO RECORD', category: "Contact" },
    { icon: MapPin, label: "Your Location", value: userProfile?.country ? `${userProfile.city || 'Central'}, ${userProfile.country}` : 'OFFLINE', category: "Location" },
    { 
      icon: Calendar, 
      label: "Joined On", 
      value: formatDateWithTime(userProfile?.createdAt || user.metadata.creationTime), 
      category: "General" 
    },
    { icon: Award, label: "Current Plan", value: userProfile?.tier?.toUpperCase() || 'BASIC', category: "Plan" },
    { icon: Shield, label: "Identity Check", value: userProfile?.verificationLevel?.toString() || '0', category: "Private Info" },
    { icon: Activity, label: "Profile Status", value: userProfile?.isBanned ? 'RESTRICTED' : 'ACTIVE', category: "General" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-200 dark:border-white/10"
          >
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">MY ACCOUNT DETAILS</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">Your personal information</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accountDetails.map((detail, idx) => (
                  <div key={idx} className="p-6 rounded-[32px] bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 group/detail hover:border-blue-500/30 transition-all shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 text-blue-500 group-hover/detail:scale-110 transition-transform shadow-sm">
                        <detail.icon size={18} />
                      </div>
                      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{detail.category}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{detail.label}</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white break-all leading-relaxed">{detail.value}</p>
                      {detail.label === "Joined On" && (
                        <AccountAge createdAt={userProfile?.createdAt || user.metadata.creationTime} />
                      )}
                      {detail.label === "Current Plan" && userProfile?.tier !== 'vip2' && userProfile?.tier !== 'premium' && (
                        <button
                          onClick={() => {
                            onClose();
                            router.push(userProfile?.role === 'user' ? '/upgrade' : '/expert/upgrade');
                          }}
                          className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                        >
                          <Zap size={10} className="animate-pulse fill-white" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Upgrade Plan</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 flex items-center gap-4 px-4 py-3 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                <Fingerprint className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Your data is safe with us. Only you can see this information.
                </p>
              </div>
              <button 
                onClick={() => {
                  onClose();
                  onEdit();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                <Settings size={14} />
                Change My Info
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
