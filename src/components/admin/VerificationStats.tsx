import React from 'react';
import { Database, Loader2, Plus, Users, History } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { StatCard } from './StatCard';

interface VerificationStatsProps {
  pendingCount: number;
  verifiedCount: number;
  seeding: boolean;
  handleSeed: () => void;
}

export function VerificationStats({ 
  pendingCount, 
  verifiedCount, 
  seeding, 
  handleSeed 
}: VerificationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard icon={<Users />} label="Pending" value={pendingCount.toString()} color="bg-blue-50 text-blue-600" />
      <StatCard icon={<History />} label="Verified" value={verifiedCount.toString()} color="bg-emerald-50 text-emerald-600" />
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
  );
}
