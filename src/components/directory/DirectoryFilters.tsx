'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Navigation, SlidersHorizontal, Key, Shield, Loader2 } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';
import { countries } from '@/lib/countries';

interface DirectoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  nearbyOnly: boolean;
  setNearbyOnly: (nearby: boolean) => void;
  requestUserLocation: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
  filterType: string;
  setFilterType: (type: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  accessCode: string;
  setAccessCode: (code: string) => void;
  verifyingCode: boolean;
  handleVerifyCode: () => void;
  t: any;
}

export function DirectoryFilters({
  searchQuery,
  setSearchQuery,
  nearbyOnly,
  setNearbyOnly,
  requestUserLocation,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  filterType,
  setFilterType,
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState,
  accessCode,
  setAccessCode,
  verifyingCode,
  handleVerifyCode,
  t
}: DirectoryFiltersProps) {
  return (
    <div className="sticky top-24 z-40 mb-12">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white dark:border-slate-800 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-900 dark:text-white"
          />
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => nearbyOnly ? setNearbyOnly(false) : requestUserLocation()}
            className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${
              nearbyOnly
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Navigation className={`w-4 h-4 ${nearbyOnly ? 'fill-current' : ''}`} />
            {t('nearby')}
          </button>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${
              showFilters || activeFiltersCount > 0
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t('filters')}
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center text-[10px]">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('profType')}</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'doctor', 'herbal_practitioner', 'hospital'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        filterType === type 
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {type === 'all' ? t('all') : type === 'herbal_practitioner' ? t('herbal') : t(type)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('country')}</label>
                <Dropdown
                  value={selectedCountry}
                  onChange={(val) => { setSelectedCountry(val); setSelectedState(''); }}
                  options={[
                    { value: '', label: t('allCountries') },
                    ...countries.map(c => ({
                      value: c.name,
                      label: c.name,
                    }))
                  ]}
                  placeholder={t('selectCountry')}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('stateRegion')}</label>
                <input 
                  type="text"
                  placeholder={t('placeholderState')}
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none font-bold text-sm text-slate-900 dark:text-white transition-colors"
                />
              </div>

              <div className="space-y-3 md:col-span-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 ml-1 flex items-center gap-2">
                  <Key className="w-3 h-3" /> Private Clinical Access
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit Private Access Code"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-amber-500 outline-none transition-all font-black tracking-[0.3em] text-lg text-slate-900 dark:text-white placeholder:tracking-normal placeholder:text-xs placeholder:font-bold"
                    />
                  </div>
                  <button
                    onClick={handleVerifyCode}
                    disabled={accessCode.length !== 6 || verifyingCode}
                    className="px-8 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 min-w-[140px] shadow-lg shadow-amber-500/20 disabled:shadow-none"
                  >
                    {verifyingCode ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        Unlock Node
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Unlocks direct access to private expert profiles</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
