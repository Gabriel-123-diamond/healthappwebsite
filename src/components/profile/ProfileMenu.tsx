'use client';

import React, { useState } from 'react';
import { Shield, HelpCircle, Trash2, LogOut, Users as UsersIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { deleteAccount } from '@/services/dataService';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface ProfileMenuProps {
  t: any;
}

export default function ProfileMenu({ t }: ProfileMenuProps) {
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
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
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
    >
      <div className="divide-y divide-slate-100">
         <Link href="/referrals" className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left">
          <UsersIcon className="w-5 h-5 text-slate-400" />
          <span className="font-medium text-slate-700">My Referrals</span>
        </Link>
         <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left">
          <Shield className="w-5 h-5 text-slate-400" />
          <span className="font-medium text-slate-700">{t.profile.privacy}</span>
        </button>
        <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left">
          <HelpCircle className="w-5 h-5 text-slate-400" />
          <span className="font-medium text-slate-700">{t.profile.help}</span>
        </button>
        <button 
          onClick={handleDelete}
          disabled={processing}
          className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors text-left text-red-600 disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
          <span className="font-medium">{processing ? 'Deleting...' : t.profile.deleteAccount}</span>
        </button>
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left text-slate-600"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t.profile.signOut}</span>
        </button>
      </div>
    </motion.div>
  );
}
