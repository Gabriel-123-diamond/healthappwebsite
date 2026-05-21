import React from 'react';
import { SlidersHorizontal, Search, Users, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface StaffPageHeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  activeFiltersCount: number;
}

export const StaffPageHeader: React.FC<StaffPageHeaderProps> = ({
  searchQuery, setSearchQuery,
  showFilters, setShowFilters,
  activeFiltersCount
}) => {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
      <div className="space-y-4">
        <Link href="/expert/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2">
          <ArrowLeft size={12} /> Institutional Console
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Users size={24} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            Clinical <span className="text-blue-600">Staff.</span>
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
          Manage internal orchestration nodes and specialist links for this facility. 
        </p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text"
            placeholder="Search Staff Identity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
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
    </header>
  );
};
