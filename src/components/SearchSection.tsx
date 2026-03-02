'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, AlertCircle, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIIntelligence } from '@/hooks/useAIIntelligence';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useSearchSafety } from '@/hooks/useSearchSafety';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import SearchResults from './SearchResults';
import SearchInput from './search/SearchInput';
import SearchFilters from './search/SearchFilters';
import { useTranslations } from 'next-intl';

const SearchSection: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const [query, setQuery] = useState('');
  
  const { loading: isLoadingAuth } = useUserAuth();
  const safetyResult = useSearchSafety(query);
  const { response: aiResponse, isSearching, error, performSearch } = useAIIntelligence();
  const { 
    searchMode, setSearchMode, 
    executedMode, 
    displayMode, setDisplayMode, 
    filterFormat, setFilterFormat,
    handleSearchComplete 
  } = useSearchFilters();
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoadingAuth || !query.trim() || safetyResult?.hasRedFlag) return;

    await performSearch(query, searchMode);
    handleSearchComplete(searchMode);
  };

  useEffect(() => {
    // We now allow unauthenticated searches (showing blurred results)
    // so we don't redirect to sign-in here anymore.
  }, [error, router]);

  const hasResults = !!aiResponse;

  return (
    <section className={`transition-all duration-700 ease-in-out px-4 pt-24 sm:pt-32 relative ${hasResults ? 'py-12 sm:py-16 bg-white dark:bg-slate-950 min-h-screen' : 'py-24 sm:py-40 bg-white dark:bg-slate-950 overflow-hidden'}`}>
      {/* Animated Intelligence Grid Background */}
      {!hasResults && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          <motion.div 
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full opacity-50 dark:opacity-20"
          >
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-400/20 blur-[100px] rounded-full" />
          </motion.div>
        </div>
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="searching"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20"
            >
              <div className="flex justify-center gap-4 mb-12">
                <div className="relative">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      borderRadius: ["30%", "50%", "30%"]
                    }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-3xl shadow-blue-500/40 flex items-center justify-center relative z-10"
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>
                  {/* Orbiting particles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3 + i, ease: "linear" }}
                      className="absolute inset-[-20px] border border-blue-500/20 rounded-full"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-lg shadow-blue-500/50" />
                    </motion.div>
                  ))}
                </div>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-none">{t('common.synthesizingIntelligence')}</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">{t('common.synthesizingSubtitle')}</p>
            </motion.div>
          ) : !hasResults ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center mb-20"
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-slate-100 dark:border-slate-800 cursor-default shadow-xl shadow-blue-500/5"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                {t('home.heroTag')}
              </motion.div>
              <h1 className="text-6xl sm:text-7xl md:text-[100px] font-black text-slate-900 dark:text-white mb-10 tracking-tighter leading-[0.85] filter drop-shadow-sm">
                {t('home.heroTitle')} <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-gradient-x">{t('home.heroTitleSpan')}</span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-500 dark:text-slate-400 mb-16 max-w-3xl mx-auto px-4 font-medium leading-relaxed opacity-80">
                {t('home.heroSubtitle')}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className={`transition-all duration-1000 ease-[0.22,1,0.36,1] ${hasResults ? 'mb-12' : 'max-w-3xl mx-auto'}`}>
          <SearchInput
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            isSearching={isSearching}
            hasResults={hasResults}
            safetyResult={safetyResult}
            placeholder={t('common.searchPlaceholder')}
            searchLabel={t('common.search')}
          />

          <div className="mt-8 flex flex-col items-center gap-6">
            <SearchFilters
              hasResults={hasResults}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
              executedMode={executedMode}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              filterFormat={filterFormat}
              setFilterFormat={setFilterFormat}
              t={t}
            />
            
            {!hasResults && !isSearching && (
              <div className="flex flex-wrap justify-center gap-3 opacity-60">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 py-2">{t('common.trySearching')}</span>
                {['Diabetes Management', 'Ashwagandha Benefits', 'Mental Wellness'].map(term => (
                  <button 
                    key={term}
                    onClick={() => { setQuery(term); }}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all uppercase tracking-wider"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {error && error !== "User must be authenticated" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-8 max-w-2xl mx-auto p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[32px] flex items-start gap-4 text-red-700 dark:text-red-400 shadow-xl shadow-red-500/5"
            >
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-widest leading-none">{t('common.securityIntercepted')}</p>
                <p className="text-sm font-medium leading-relaxed opacity-80">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={resultsRef} className="scroll-mt-24">
          <SearchResults response={aiResponse} isSearching={isSearching} filterFormat={filterFormat} query={query} mode={displayMode} />
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
