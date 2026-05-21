import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, History, ShieldAlert } from 'lucide-react';
import { UserProfile } from '@/types';

interface VerifiedHistoryTableProps {
  filteredHistory: UserProfile[];
  setSelectedExpert: (expert: UserProfile) => void;
  handleUnverify: (id: string) => void;
}

export function VerifiedHistoryTable({ 
  filteredHistory, 
  setSelectedExpert, 
  handleUnverify 
}: VerifiedHistoryTableProps) {
  return (
    <motion.div
      key="history-list"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="overflow-x-auto"
    >
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 dark:bg-white/[0.02] text-slate-400 text-[10px] uppercase font-black tracking-widest">
          <tr>
            <th className="p-8">Verified Expert</th>
            <th className="p-8">Verification Date</th>
            <th className="p-8 text-right">Revocation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {filteredHistory.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-24 text-center">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[32px] flex items-center justify-center mb-6 border border-slate-100 dark:border-white/5 shadow-inner">
                    <History size={32} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">No Records Found</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs text-sm">
                    No verified experts match the selected temporal range.
                  </p>
                </motion.div>
              </td>
            </tr>
          ) : (
            filteredHistory.map((expert) => (
              <tr key={expert.uid} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{expert.fullName}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{expert.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 italic">
                    {new Date(expert.updatedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </td>
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-2">
                     <button 
                      onClick={() => setSelectedExpert(expert)}
                      className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 border border-slate-100 dark:border-white/5 transition-all shadow-sm"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleUnverify(expert.uid)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                    >
                      <ShieldAlert size={14} /> Unverify
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  );
}
