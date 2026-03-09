import React from 'react';
import { motion } from 'framer-motion';
import { Database, Loader2, Plus, Users, Shield, Eye } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { UserProfile } from '@/types';
import { StatCard } from './StatCard';

interface VerificationTabProps {
  experts: UserProfile[];
  seeding: boolean;
  handleSeed: () => void;
  setSelectedExpert: (expert: UserProfile) => void;
}

export function VerificationTab({
  experts,
  seeding,
  handleSeed,
  setSelectedExpert,
}: VerificationTabProps) {
  return (
    <motion.div 
      key="verif"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Users />} label="Pending Applications" value={experts.length.toString()} color="bg-blue-50 text-blue-600" />
        <StatCard icon={<Shield />} label="System Status" value="Active" color="bg-emerald-50 text-emerald-600" />
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-50 rounded-2xl text-amber-600"><Database size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Maintenance</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Live Data Synchronization</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button onClick={handleSeed} disabled={seeding} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-200 transition-all disabled:opacity-50">
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Seed V2'}
              </button>
              <Link href="/admin/learning/create" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2">
                <Plus size={14} /> Course
              </Link>
           </div>
        </div>
      </div>

      {/* Pending Experts Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-white/5">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Expert Pipeline</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized clinical verification queue</p>
        </div>
        <div className="overflow-x-auto">
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
                  <td colSpan={3} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No pending protocols in queue</td>
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
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-400 transition-all shadow-lg active:scale-95 ml-auto"
                      >
                        <Eye className="w-4 h-4 inline mr-2" /> Decrypt Data
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
