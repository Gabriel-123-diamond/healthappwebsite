import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Shield, CheckCircle, Trash2 } from 'lucide-react';
import { UserProfile } from '@/types';
import { PerformanceMonitor } from './PerformanceMonitor';

interface AdminGridTabProps {
  admins: UserProfile[];
  setShowAddAdmin: (show: boolean) => void;
}

export function AdminGridTab({
  admins,
  setShowAddAdmin,
}: AdminGridTabProps) {
  return (
    <motion.div 
      key="admins"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-12"
    >
      <PerformanceMonitor />

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Authorized Administrators</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px] font-black">Super User Authority Node</p>
        </div>
        <button 
          onClick={() => setShowAddAdmin(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-none"
        >
          <UserPlus size={18} /> Add Authority
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-900 p-24 rounded-[48px] border border-slate-100 dark:border-white/5 shadow-sm text-center flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[32px] flex items-center justify-center mb-6 border border-slate-100 dark:border-white/5 shadow-inner">
                  <Shield size={32} className="text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">No Authorities Found</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs text-sm">
                  The central authority registry is currently empty. Initialize a new admin node to begin system governance.
                </p>
                <button 
                  onClick={() => setShowAddAdmin(true)}
                  className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                >
                  Create Initial Authority
                </button>
              </motion.div>
          </div>
        ) : (
          admins.map((admin) => (
          <div key={admin.uid} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm relative group">
            <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white mb-6 group-hover:rotate-6 transition-transform">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{admin.fullName || 'Admin Node'}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{admin.email}</p>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle size={12} /> Active Access
               </span>
               <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        )))}
      </div>
    </motion.div>
  );
}
