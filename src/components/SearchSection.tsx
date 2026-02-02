'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Stethoscope, Leaf, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { checkSafety, SafetyCheckResult } from '@/services/safetyService';
import { searchHealthTopic, AIResponse } from '@/services/aiService';
import SearchResults from './SearchResults';
import { useTranslations } from 'next-intl';

const SearchSection: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'medical' | 'herbal' | 'both'>('both');
  const [executedMode, setExecutedMode] = useState<'medical' | 'herbal' | 'both'>('both'); // Mode used for the actual search
  const [displayMode, setDisplayMode] = useState<'medical' | 'herbal' | 'both'>('both'); // Mode used for client-side filtering
  const [filterFormat, setFilterFormat] = useState<'all' | 'article' | 'video'>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [safetyResult, setSafetyResult] = useState<SafetyCheckResult | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // ... (other useEffects)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoadingAuth) return; // Wait for auth check

    if (!query.trim() || safetyResult?.hasRedFlag) return;

    setIsSearching(true);
    setAiResponse(null);
    setError(null);

    try {
      const response = await searchHealthTopic(query, searchMode);
      setAiResponse(response);
      setExecutedMode(searchMode);
      setDisplayMode(searchMode);
    } catch (err: any) {
      console.error("Search failed:", err);
      if (err.message === "User must be authenticated") {
        router.push('/auth/signin');
        return;
      }
      setError(err.message || "An unexpected error occurred during search.");
    } finally {
      setIsSearching(false);
    }
  };

  const hasResults = !!aiResponse;

  return (
    <section className={`transition-all duration-700 ease-in-out px-4 ${hasResults ? 'py-6 bg-white dark:bg-slate-900 min-h-screen' : 'py-20 bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 min-h-[600px]'}`}>
      <div className="max-w-4xl mx-auto">
        {/* ... (Hero / Searching animations remain same) */}
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="searching"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <div className="flex justify-center gap-4 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl"
                >
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </motion.div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ikiké is thinking...</h2>
              <p className="text-slate-500 dark:text-slate-400">Searching through medical journals and herbal wisdom</p>
            </motion.div>
          ) : !hasResults ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center overflow-hidden"
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 cursor-default"
              >
                <Sparkles className="w-4 h-4" />
                {t('home.heroTag')}
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                {t('home.heroTitle')} <span className="text-blue-600">{t('home.heroTitleSpan')}</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                {t('home.heroSubtitle')}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className={`transition-all duration-500 ${hasResults ? 'mb-4 mt-4' : 'mb-8 text-center'}`}>
          <form onSubmit={handleSearch} className={`relative max-w-3xl ${hasResults ? '' : 'mx-auto'}`}>
            <motion.div 
              className="relative group"
              layout
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('common.searchPlaceholder')}
                className={`w-full pl-14 pr-32 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-xl ${hasResults ? 'py-3 text-base' : 'py-5 text-lg'}`}
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <motion.button
                type="submit"
                disabled={isSearching || !!safetyResult?.hasRedFlag}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2 ${
                  (isSearching || !!safetyResult?.hasRedFlag) ? 'opacity-50 cursor-not-allowed' : ''
                } ${hasResults ? 'px-4 py-2 text-sm' : 'px-6 py-3'}`}
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : t('common.search')}
              </motion.button>
            </motion.div>
            
            <AnimatePresence>
              {safetyResult?.hasRedFlag && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 text-left overflow-hidden"
                >
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-800 dark:text-red-400 flex items-center gap-2">
                      {safetyResult.redFlagType || 'Emergency Warning'}
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {safetyResult.message} <strong>{safetyResult.action}</strong>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Controls Container */}
        <motion.div 
          layout
          className={`flex flex-col md:flex-row gap-4 mb-6 ${hasResults ? 'items-start md:items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4' : 'items-center justify-center flex-col'}`}
        >
          {/* Search Modes */}
          <div className={`flex flex-wrap gap-2 ${hasResults ? 'justify-start' : 'justify-center'}`}>
            {(!hasResults || executedMode === 'medical' || executedMode === 'both') && (
              <SearchModeButton 
                active={hasResults ? displayMode === 'medical' : searchMode === 'medical'} 
                onClick={() => hasResults ? setDisplayMode('medical') : setSearchMode('medical')} 
                label={t('common.medical')} 
                icon={<Stethoscope className="w-4 h-4" />}
                colorClass="bg-blue-600"
                hoverClass="hover:border-blue-300"
                compact={hasResults}
              />
            )}
            {(!hasResults || executedMode === 'herbal' || executedMode === 'both') && (
              <SearchModeButton 
                active={hasResults ? displayMode === 'herbal' : searchMode === 'herbal'} 
                onClick={() => hasResults ? setDisplayMode('herbal') : setSearchMode('herbal')} 
                label={t('common.herbal')} 
                icon={<Leaf className="w-4 h-4" />}
                colorClass="bg-emerald-600"
                hoverClass="hover:border-emerald-300"
                compact={hasResults}
              />
            )}
            {(!hasResults || executedMode === 'both') && (
              <SearchModeButton 
                active={hasResults ? displayMode === 'both' : searchMode === 'both'} 
                onClick={() => hasResults ? setDisplayMode('both') : setSearchMode('both')} 
                label={t('common.both')} 
                icon={<Sparkles className="w-4 h-4" />}
                colorClass="bg-slate-800"
                hoverClass="hover:border-slate-400"
                compact={hasResults}
              />
            )}
          </div>

          {/* Content Filters */}
          <div className={`flex gap-2 ${hasResults ? 'justify-start' : 'justify-center'}`}>
            <button
              onClick={() => setFilterFormat('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterFormat === 'all' ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              All Results
            </button>
            <button
              onClick={() => setFilterFormat('article')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterFormat === 'article' ? 'bg-blue-600 text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'}`}
            >
              Articles
            </button>
            <button
              onClick={() => setFilterFormat('video')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterFormat === 'video' ? 'bg-red-600 text-white' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50'}`}
            >
              Videos
            </button>
          </div>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-8 max-w-3xl mx-auto p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Display */}
        <div ref={resultsRef} className="scroll-mt-24">
          <SearchResults response={aiResponse} isSearching={isSearching} filterFormat={filterFormat} query={query} mode={displayMode} />
        </div>
      </div>
    </section>
  );
};

function SearchModeButton({ active, onClick, label, icon, colorClass, hoverClass, compact }: any) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
      className={`flex items-center gap-2 rounded-xl font-medium transition-colors ${
        active
          ? `${colorClass} text-white shadow-lg`
          : `bg-white text-slate-600 border border-slate-200 ${hoverClass}`
      } ${compact ? 'px-3 py-2 text-sm' : 'px-6 py-3'}`}
    >
      {icon}
      {label}
    </motion.button>
  );
}

export default SearchSection;
