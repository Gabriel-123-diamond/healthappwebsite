'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, AlertCircle } from 'lucide-react';
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
    if (error === "User must be authenticated") {
      router.push('/auth/signin');
    }
  }, [error, router]);

  const hasResults = !!aiResponse;

  return (
    <section className={`transition-all duration-700 ease-in-out px-4 ${hasResults ? 'py-4 sm:py-6 bg-white dark:bg-slate-900 min-h-screen' : 'py-12 sm:py-20 bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 min-h-[500px] sm:min-h-[600px]'}`}>
      <div className="max-w-4xl mx-auto">
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
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
                {t('home.heroTitle')} <span className="text-blue-600 block sm:inline">{t('home.heroTitleSpan')}</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
                {t('home.heroSubtitle')}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

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

        <AnimatePresence>
          {error && error !== "User must be authenticated" && (
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

        <div ref={resultsRef} className="scroll-mt-24">
          <SearchResults response={aiResponse} isSearching={isSearching} filterFormat={filterFormat} query={query} mode={displayMode} />
        </div>
      </div>
    </section>
  );
};

export default SearchSection;