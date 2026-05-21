import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Eye, CheckCircle, XCircle } from 'lucide-react';
import { UserProfile } from '@/types';

interface TierUpgradeTabProps {
  upgrades: UserProfile[];
  onView: (expert: UserProfile) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export function TierUpgradeTab({
  upgrades,
  onView,
  onApprove,
  onReject,
}: TierUpgradeTabProps) {
  const [rejectId, setRejectId] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden"
    >
      <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Authority Upgrades</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pending tier advancement requests</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="p-8">Expert Node</th>
              <th className="p-8">Target Tier</th>
              <th className="p-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {upgrades.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-24 text-center">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[32px] flex items-center justify-center mb-6 border border-slate-100 dark:border-white/5 shadow-inner">
                      <Award size={32} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Clear Authority Stream</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs text-sm">
                      All tier advancement requests have been processed. No pending upgrades detected.
                    </p>
                  </motion.div>
                </td>
              </tr>
            ) : (
              upgrades.map((expert) => (
                <tr key={expert.uid} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                        <Award size={18} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{expert.fullName}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{expert.specialty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      expert.requestedTier === 'premium' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {expert.requestedTier}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onView(expert)} className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 border border-slate-100 dark:border-white/5 transition-all"><Eye size={16} /></button>
                      <button onClick={() => onApprove(expert.uid)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle size={16} /></button>
                      <button onClick={() => setRejectId(expert.uid)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><XCircle size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {rejectId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-black uppercase tracking-tight mb-4">Reject Upgrade</h3>
            <textarea 
              value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none text-sm font-bold mb-6"
              rows={4}
            />
            <div className="flex gap-4">
              <button onClick={() => { setRejectId(null); setReason(''); }} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Cancel</button>
              <button onClick={() => { onReject(rejectId, reason); setRejectId(null); setReason(''); }} className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20">Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
