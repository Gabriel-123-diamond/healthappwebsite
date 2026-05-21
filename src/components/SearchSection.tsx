'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, AlertCircle, Search, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIIntelligence } from '@/hooks/useAIIntelligence';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useSearchSafety } from '@/hooks/useSearchSafety';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import SearchResults from './SearchResults';
import SearchInput from './search/SearchInput';
import SearchFilters from './search/SearchFilters';
import { HeroSection } from './search/HeroSection';
import { SearchingState } from './search/SearchingState';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import NiceModal from './common/NiceModal';

const SearchSection: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const [query, setQuery] = useState('');
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  const { loading: isLoadingAuth } = useUserAuth();
  const safetyResult = useSearchSafety(query);
  const { response: aiResponse, isSearching, error, performSearch } = useAIIntelligence();

  // Show modal if daily limit is reached
  useEffect(() => {
    if (error?.includes("upgrade your node")) {
      setShowLimitModal(true);
    }
  }, [error]);
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
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.07)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_100%)]" />
          
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
            <SearchingState t={t} />
          ) : !hasResults ? (
            <HeroSection t={t} />
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
            remainingSearches={aiResponse?.remainingSearches}
            isUnlimited={aiResponse?.isUnlimited}
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
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-widest leading-none">{t('common.securityIntercepted')}</p>
                  <p className="text-sm font-medium leading-relaxed opacity-80">{error}</p>
                </div>
                {error.includes("upgrade your node") && (
                  <Link 
                    href="/upgrade" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
                  >
                    {t('search.upgradeNode')}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={resultsRef} className="scroll-mt-24">
          <SearchResults response={aiResponse} isSearching={isSearching} filterFormat={filterFormat} query={query} mode={displayMode} />
        </div>
      </div>

      <NiceModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onConfirm={() => {
          setShowLimitModal(false);
          router.push('/upgrade');
        }}
        title={t('search.limitReached')}
        description={t('search.limitDesc')}
        confirmText={t('search.upgradeNode')}
        cancelText={t('search.maybeLater')}
        type="upgrade"
        features={[
          t('search.unlimitedAi'),
          t('search.priorityQueue'),
          t('search.globalArchives'),
          t('search.explainableAi')
        ]}
      />
    </section>
  );
};

export default SearchSection;
