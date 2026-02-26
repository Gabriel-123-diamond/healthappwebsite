'use client';

import React, { useState } from 'react';
import { Shield, HelpCircle, Trash2, LogOut, Users as UsersIcon, Download, Loader2, Code, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { deleteAccount } from '@/services/dataService';
import { userService } from '@/services/userService';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { isExpertRole } from '@/types/user';

interface ProfileMenuProps {
  t: any;
  userProfile?: any;
}

export default function ProfileMenu({ t, userProfile }: ProfileMenuProps) {
  const [processing, setProcessing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const router = useRouter();
  
  const isExpert = isExpertRole(userProfile?.role || '');

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleExport = async () => {
    if (!auth.currentUser) return;
    setExporting(true);
    try {
      const data = await userService.getUserProfile(auth.currentUser.uid); // or specific export service
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
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    
    setProcessing(true);
    try {
      await deleteAccount();
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Failed to delete account');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
    >
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {isExpert && (
          <Link href="/tools" className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left border-l-4 border-l-blue-600">
            <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Expert Dashboard</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Manage your medical profile and consultations</span>
            </div>
          </Link>
        )}
        
        <Link href="/referrals" className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
          <UsersIcon className="w-5 h-5 text-slate-400" />
          <span className="font-medium text-slate-700 dark:text-slate-300">My Referrals</span>
        </Link>
        <Link href="/developer" className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
          <Code className="w-5 h-5 text-slate-400" />
          <span className="font-medium text-slate-700 dark:text-slate-300">Developer Settings</span>
        </Link>
        <button 
          onClick={handleExport}
          disabled={exporting}
          className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> : <Download className="w-5 h-5 text-slate-400" />}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {exporting ? 'Preparing export...' : t.profile.exportData}
          </span>
        </button>
         <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
          <Shield className="w-5 h-5 text-slate-400" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{t.profile.privacy}</span>
        </button>
        <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
          <HelpCircle className="w-5 h-5 text-slate-400" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{t.profile.help}</span>
        </button>
        <button 
          onClick={handleDelete}
          disabled={processing}
          className="w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-red-600 disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
          <span className="font-medium">{processing ? 'Deleting...' : t.profile.deleteAccount}</span>
        </button>
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left text-slate-600 dark:text-slate-400"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t.profile.signOut}</span>
        </button>
      </div>
    </motion.div>
  );
}
