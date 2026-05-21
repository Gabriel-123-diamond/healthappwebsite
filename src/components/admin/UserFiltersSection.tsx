import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, User, Activity, 
  Search, Calendar, SlidersHorizontal, X
} from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';

interface UserFiltersSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  tierFilter: string;
  setTierFilter: (tier: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
}

export function UserFiltersSection({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  tierFilter,
  setTierFilter,
  dateRange,
  setDateRange,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  clearFilters
}: UserFiltersSectionProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Citizen Network</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px] font-black">Central Intelligence Registry</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search Identity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl border transition-all relative ${
              showFilters || activeFiltersCount > 0
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-400'
            }`}
          >
            <SlidersHorizontal size={18} />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="relative z-50"
          >
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Role</label>
                <Dropdown 
                  value={roleFilter}
                  onChange={setRoleFilter}
                  options={[
                    { value: 'all', label: 'All Roles' },
                    { value: 'user', label: 'Citizens', icon: <User size={12} /> },
                    { value: 'expert', label: 'Intelligence Nodes', icon: <Activity size={12} /> },
                    { value: 'admin', label: 'System Admins', icon: <Shield size={12} /> },
                  ]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Evolution Tier</label>
                <Dropdown 
                  value={tierFilter}
                  onChange={setTierFilter}
                  options={[
                    { value: 'all', label: 'All Tiers' },
                    { value: 'basic', label: 'Basic' },
                    { value: 'pro', label: 'Pro' },
                    { value: 'elite', label: 'Elite' },
                  ]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phase Delta</label>
                <Dropdown 
                  value={dateRange}
                  onChange={setDateRange}
                  options={[
                    { value: 'all', label: 'All Time', icon: <Calendar size={12} /> },
                    { value: '7d', label: 'Last 7 Days' },
                    { value: '30d', label: 'Last 30 Days' },
                    { value: '90d', label: 'Last 90 Days' },
                  ]}
                />
              </div>
              {activeFiltersCount > 0 && (
                <div className="sm:col-span-3 flex justify-end">
                  <button 
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                  >
                    <X size={12} /> Reset System Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
