'use client';

import React from 'react';
import { Search, ChevronLeft, SlidersHorizontal, MapPin, Globe } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Dropdown } from '@/components/ui/Dropdown';
import { countries } from '@/lib/countries';
import { motion } from 'framer-motion';

interface SearchHeaderProps {
  query: string;
  setQuery: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  activeTab: string;
  setActiveTab: (t: any) => void;
  setCurrentPage: (p: number) => void;
  selectedCountry: string;
  setSelectedCountry: (c: string) => void;
  selectedState: string;
  setSelectedState: (s: string) => void;
  distanceRange: number;
  setDistanceRange: (r: number) => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  query, setQuery, onSearchSubmit, activeTab, setActiveTab, setCurrentPage,
  selectedCountry, setSelectedCountry, selectedState, setSelectedState,
  distanceRange, setDistanceRange
}) => {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800 sticky top-16 z-40 py-6">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm">
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Clinical Results</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Synthesis Protocol Active</p>
            </div>
          </div>

          <form onSubmit={onSearchSubmit} className="flex-1 max-w-2xl relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search health topics..."
              className="w-full pl-14 pr-32 py-4 rounded-[20px] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-inner"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
              Update
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            {['all', 'experts', 'articles', 'videos'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab as any); setCurrentPage(1); }}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-lg' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

          {/* Advanced Filters Trigger/Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-48">
              <Dropdown
                value={selectedCountry}
                onChange={setSelectedCountry}
                options={[{ value: '', label: 'Global Registry' }, ...countries.map(c => ({ value: c.name, label: c.name.charAt(0).toUpperCase() + c.name.slice(1), icon: <span>{c.flag}</span> }))]}
                placeholder="Region"
                className="!rounded-2xl !py-2.5 !text-[10px] font-black uppercase"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl px-4 py-2.5 group">
              <MapPin size={14} className="text-slate-400 group-focus-within:text-blue-500" />
              <input 
                type="text" 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value)} 
                placeholder="State/City..." 
                className="bg-transparent border-none text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:ring-0 w-24 tracking-widest" 
              />
            </div>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl px-4 py-2.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Radius</span>
              <input type="range" min="5" max="500" value={distanceRange} onChange={(e) => setDistanceRange(Number(e.target.value))} className="w-20 h-1 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-600" />
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 w-10 text-right">{distanceRange}km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
