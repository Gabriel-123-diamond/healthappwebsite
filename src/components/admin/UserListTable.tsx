import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, Shield, User, Activity, SearchX, ShieldAlert, ShieldCheck
} from 'lucide-react';
import { UserProfile } from '@/types';

interface UserListTableProps {
  filteredUsers: UserProfile[];
  onEdit: (user: UserProfile) => void;
  onToggleBlock?: (user: UserProfile) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
}

export function UserListTable({
  filteredUsers,
  onEdit,
  onToggleBlock,
  activeFiltersCount,
  clearFilters
}: UserListTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        {filteredUsers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 flex flex-col items-center justify-center text-center px-6"
          >
            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[32px] flex items-center justify-center mb-6 border border-slate-100 dark:border-white/5 shadow-inner">
              <SearchX size={32} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">No Citizens Found</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs text-sm">
              No intelligence nodes match your current filter parameters. Try expanding your search criteria.
            </p>
            {activeFiltersCount > 0 && (
              <button 
                onClick={clearFilters}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
              >
                Clear All Filters
              </button>
            )}
          </motion.div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Node Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Access Tier</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Evolution</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-sm font-medium text-slate-600 dark:text-slate-300">
              <AnimatePresence mode='popLayout'>
                {filteredUsers.map((user) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={user.uid} 
                    className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {user.role === 'admin' ? <Shield size={18} /> : <User size={18} />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{user.fullName || 'Anonymous Node'}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${user.role === 'user' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                        <span className="uppercase tracking-widest text-[10px] font-black">{user.role}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-blue-500" />
                        <span className="uppercase tracking-widest text-[10px] font-black">{user.tier || 'basic'}</span>
                      </div>
                    </td>
                    <td className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Initial Phase'}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onToggleBlock?.(user)}
                          title={user.isBanned ? "Unblock Node" : "Block Node"}
                          className={`p-2 rounded-lg transition-all ${user.isBanned ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'}`}
                        >
                          {user.isBanned ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                        </button>
                        <button 
                          onClick={() => onEdit(user)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
