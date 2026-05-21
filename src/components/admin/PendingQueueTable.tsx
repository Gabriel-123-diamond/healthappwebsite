import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye } from 'lucide-react';
import { UserProfile } from '@/types';

interface PendingQueueTableProps {
  experts: UserProfile[];
  setSelectedExpert: (expert: UserProfile) => void;
}

export function PendingQueueTable({ experts, setSelectedExpert }: PendingQueueTableProps) {
  return (
    <motion.div
      key="pending-list"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="overflow-x-auto"
    >
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 dark:bg-white/[0.02] text-slate-400 text-[10px] uppercase font-black tracking-widest">
          <tr>
            <th className="p-8">Candidate / Identity</th>
            <th className="p-8">Protocol Info</th>
            <th className="p-8 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {experts.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-24 text-center">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[32px] flex items-center justify-center mb-6 border border-slate-100 dark:border-white/5 shadow-inner">
                    <Shield size={32} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Queue Optimized</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs text-sm">
                    No pending expert protocols in the decryption queue. System is fully synchronized.
                  </p>
                </motion.div>
              </td>
            </tr>
          ) : (
            experts.map((expert) => (
              <tr key={expert.uid} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <td className="p-8">
                  <div>
                    <p className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-tight">{expert.fullName}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">{expert.expertProfile?.type || expert.role}</p>
                  </div>
                </td>
                <td className="p-8">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{expert.email}</p>
                    <p className="text-xs text-slate-400">{expert.expertProfile?.specialty || 'N/A'}</p>
                  </div>
                </td>
                <td className="p-8 text-right">
                  <button 
                    onClick={() => setSelectedExpert(expert)}
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-400 transition-all shadow-lg active:scale-95 ml-auto border-2 border-slate-100"
                  >
                    <Eye className="w-4 h-4 inline mr-2" /> Decrypt Data
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  );
}
