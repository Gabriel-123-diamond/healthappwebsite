'use client';

import React, { useState } from 'react';
import { Shield, HelpCircle, Trash2, LogOut, Users as UsersIcon, Download, Loader2, Code, LayoutDashboard, Sparkles, ChevronRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { deleteAccount } from '@/services/dataService';
import { userService } from '@/services/userService';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { isExpertRole, UserProfile } from '@/types/user';
import { useTranslations } from 'next-intl';
import NiceModal from '@/components/common/NiceModal';

interface ProfileMenuProps {
  t: any; // Kept for potential compatibility, but hook is preferred
  userProfile: UserProfile | null;
}

export default function ProfileMenu({ userProfile }: ProfileMenuProps) {
  const t = useTranslations('profile.menu');
  const [processing, setProcessing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const router = useRouter();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type
    });
  };

  const showConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirmConfig({
      isOpen: true,
      title,
      description,
      onConfirm
    });
  };
  
  const isExpert = isExpertRole(userProfile?.role || '');

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleExport = async () => {
    if (!auth.currentUser) return;
    setExporting(true);
    try {
      const data = await userService.getUserProfile(auth.currentUser.uid);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ikike_health_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      showAlert('Export Failed', 'Failed to export data', 'warning');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    showConfirm(
      "Terminate Account",
      t('deleteConfirm') || "Are you sure you want to permanently delete your account and all associated health records? This action is irreversible.",
      async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setProcessing(true);
        try {
          await deleteAccount();
          await signOut(auth);
          router.push('/');
        } catch (error) {
          console.error(error);
          showAlert('Error', 'Failed to delete account', 'warning');
        } finally {
          setProcessing(false);
        }
      }
    );
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-[#0B1221] rounded-[32px] shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col h-fit"
      >
        <div className="p-6 border-b border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('controlSystem')}</h3>
        </div>
        
        <div className="p-3 space-y-1">
          {userProfile?.role === 'admin' && (
            <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all">
              <div className="p-2 bg-white/10 rounded-xl text-emerald-400">
                <Shield size={16} />
              </div>
              <span className="font-bold text-xs uppercase tracking-widest flex-1">{t('adminDashboard')}</span>
              <ChevronRight size={14} className="opacity-30" />
            </Link>
          )}

          {isExpert && (!userProfile?.verificationStatus || userProfile?.verificationStatus === 'unverified') && (
            <Link href="/expert/setup" className="flex items-center gap-3 p-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles size={16} />
              </div>
              <span className="font-bold text-xs uppercase tracking-widest flex-1">Initialize Verification</span>
              <ChevronRight size={14} className="opacity-50" />
            </Link>
          )}

          {isExpert && userProfile?.verificationStatus === 'pending' && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <div className="p-2 bg-amber-500 rounded-xl text-white">
                <Shield size={16} />
              </div>
              <span className="font-bold text-xs uppercase tracking-widest flex-1">{t('verificationPending')}</span>
            </div>
          )}

          {isExpert && userProfile?.verificationStatus === 'verified' && (userProfile?.tier === 'basic' || !userProfile?.tier) && (
            <Link href="/expert/upgrade" className="flex items-center gap-3 p-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles size={16} />
              </div>
              <span className="font-bold text-xs uppercase tracking-widest flex-1">{t('upgradeTier')}</span>
              <ChevronRight size={14} className="opacity-50" />
            </Link>
          )}
          
          {isExpert && userProfile?.verificationStatus === 'verified' && userProfile?.tier !== 'basic' && (
            <Link href="/expert/dashboard" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-700 dark:text-slate-300">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <LayoutDashboard size={16} />
              </div>
              <span className="font-bold text-xs uppercase tracking-widest flex-1">{t('expertConsole')}</span>
              <ChevronRight size={14} className="opacity-30" />
            </Link>
          )}

          <Link 
            href={isExpert ? "/expert/appointments" : "/appointments"} 
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-700 dark:text-slate-300"
          >
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Calendar size={16} />
            </div>
            <span className="font-bold text-xs uppercase tracking-widest flex-1">Appointments</span>
            <ChevronRight size={14} className="opacity-30" />
          </Link>
          
          <div className="h-px bg-slate-50 dark:bg-white/5 my-2 mx-2" />

          <Link href="/referrals" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-400">
            <UsersIcon size={16} className="ml-2" />
            <span className="font-bold text-xs uppercase tracking-widest flex-1">{t('network')}</span>
            <ChevronRight size={14} className="opacity-30" />
          </Link>

          <Link href="/developer" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-400">
            <Code size={16} className="ml-2" />
            <span className="font-bold text-xs uppercase tracking-widest flex-1">{t('developer')}</span>
            <ChevronRight size={14} className="opacity-30" />
          </Link>

          <button 
            onClick={handleExport}
            disabled={exporting}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-400 disabled:opacity-50"
          >
            {exporting ? <Loader2 size={16} className="ml-2 animate-spin" /> : <Download size={16} className="ml-2" />}
            <span className="font-bold text-xs uppercase tracking-widest flex-1 text-left">{t('exportData')}</span>
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-400">
            <HelpCircle size={16} className="ml-2" />
            <span className="font-bold text-xs uppercase tracking-widest flex-1 text-left">{t('assistance')}</span>
          </button>

          <div className="h-px bg-slate-50 dark:bg-white/5 my-2 mx-2" />

          <button 
            onClick={handleDelete}
            disabled={processing}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/5 transition-all text-red-500/70 disabled:opacity-50"
          >
            <Trash2 size={16} className="ml-2" />
            <span className="font-bold text-xs uppercase tracking-widest flex-1 text-left">{t('terminateAccount')}</span>
          </button>

          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all text-slate-500"
          >
            <LogOut size={16} className="ml-2" />
            <span className="font-bold text-xs uppercase tracking-widest flex-1 text-left">{t('signOut')}</span>
          </button>
        </div>
      </motion.div>

      <NiceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
      />

      <NiceModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText="Confirm Action"
        cancelText="Cancel"
        type="warning"
      />
    </>
  );
}
