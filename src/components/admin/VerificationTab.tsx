import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { UserProfile } from '@/types';
import { VerificationStats } from './VerificationStats';
import { PendingQueueTable } from './PendingQueueTable';
import { VerifiedHistoryTable } from './VerifiedHistoryTable';

interface VerificationTabProps {
  experts: UserProfile[];
  verifiedExperts: UserProfile[];
  seeding: boolean;
  handleSeed: () => void;
  setSelectedExpert: (expert: UserProfile) => void;
  handleUnverify: (id: string) => void;
}

export function VerificationTab({
  experts,
  verifiedExperts,
  seeding,
  handleSeed,
  setSelectedExpert,
  handleUnverify,
}: VerificationTabProps) {
  const [subTab, setSubTab] = useState<'pending' | 'history'>('pending');
  const [dateRange, setSubTabDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filteredHistory = useMemo(() => {
    if (dateRange === 'all') return verifiedExperts;
    const now = new Date();
    return verifiedExperts.filter(e => {
      const date = new Date(e.updatedAt);
      if (dateRange === 'today') {
        return date.toDateString() === now.toDateString();
      }
      if (dateRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
      }
      if (dateRange === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= monthAgo;
      }
      return true;
    });
  }, [verifiedExperts, dateRange]);

  return (
    <motion.div 
      key="verif"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <VerificationStats 
        pendingCount={experts.length}
        verifiedCount={verifiedExperts.length}
        seeding={seeding}
        handleSeed={handleSeed}
      />

      <div className="flex flex-col gap-6">
        {/* Sub Navigation */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-100 dark:border-white/5 w-full">
          <div className="flex gap-2">
            <button 
              onClick={() => setSubTab('pending')}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'pending' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Pipeline Queue ({experts.length})
            </button>
            <button 
              onClick={() => setSubTab('history')}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'history' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Verified History ({verifiedExperts.length})
            </button>
          </div>

          {subTab === 'history' && (
            <div className="flex items-center gap-2 mr-2">
              <Calendar size={14} className="text-slate-400" />
              <select 
                value={dateRange}
                onChange={(e) => setSubTabDateRange(e.target.value as any)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
          <AnimatePresence mode="wait">
            {subTab === 'pending' ? (
              <PendingQueueTable 
                experts={experts} 
                setSelectedExpert={setSelectedExpert} 
              />
            ) : (
              <VerifiedHistoryTable 
                filteredHistory={filteredHistory}
                setSelectedExpert={setSelectedExpert}
                handleUnverify={handleUnverify}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
