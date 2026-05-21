'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchHealthTopic } from '@/services/aiService';
import { AIResponse } from '@/types';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchFeedback } from '@/components/search/SearchFeedback';
import { AiSummarySection } from '@/components/search/AiSummarySection';
import { SearchMetadata } from '@/components/SearchMetadata';
import { SearchHeader } from '@/components/search/SearchHeader';
import { VerifiedExperts } from '@/components/search/VerifiedExperts';
import { SourceList } from '@/components/search/SourceList';
import { useTranslations } from 'next-intl';
import { 
  SearchLoading, SearchError, EmptySearchState, LoggedOutSearchBanner, Pagination 
} from '@/components/search/SearchPageComponents';

function SearchContent() {
  const t = useTranslations('searchPage');
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialMode = (searchParams.get('mode') as 'medical' | 'herbal' | 'both') || 'both';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(true);

  const [activeTab, setActiveTab] = useState<'all' | 'experts' | 'articles' | 'videos'>('all');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [distanceRange, setDistanceRange] = useState(50);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [customPage, setCustomPage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedOut(!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (initialQuery) {
      const checkCache = () => {
        const cacheKey = `search_cache_${initialQuery}_${initialMode}`;
        const cached = typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
        if (cached) {
          try { setResults(JSON.parse(cached)); return true; } catch (e) { console.error(e); }
        }
        return false;
      };
      if (!checkCache()) handleSearch(initialQuery);
    }
  }, [initialQuery, initialMode, isLoggedOut]);

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const data = await searchHealthTopic(searchQuery, initialMode);
      setResults(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || "An error occurred while searching.");
    } finally { setLoading(false); }
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}&mode=${initialMode}`);
  };

  const filteredExperts = results?.directoryMatches?.filter(expert => {
    if (selectedCountry && !expert.location.toLowerCase().includes(selectedCountry.toLowerCase())) return false;
    if (selectedState && !expert.location.toLowerCase().includes(selectedState.toLowerCase())) return false;
    return true;
  }) || [];

  const filteredArticles = results?.results.filter(r => {
    if (activeTab === 'videos' && r.format !== 'video') return false;
    if (activeTab === 'articles' && r.format !== 'article') return false;
    return true;
  }) || [];

  const currentData = activeTab === 'experts' ? filteredExperts : filteredArticles;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  // const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setCustomPage('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-600/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-600/5 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      <SearchHeader 
        query={query} setQuery={setQuery} onSearchSubmit={onSearchSubmit} activeTab={activeTab} 
        setActiveTab={setActiveTab} setCurrentPage={setCurrentPage} selectedCountry={selectedCountry} 
        setSelectedCountry={setSelectedCountry} selectedState={selectedState} setSelectedState={setSelectedState} 
        distanceRange={distanceRange} setDistanceRange={setDistanceRange} 
        remainingSearches={results?.remainingSearches} isUnlimited={results?.isUnlimited}
      />

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12 relative z-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <SearchLoading query={query} t={t} />
          ) : error ? (
            <SearchError error={error} onRetry={() => handleSearch(query)} t={t} />
          ) : !results ? (
            <EmptySearchState t={t} />
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-[48px] shadow-3xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 overflow-hidden"
              >
                <SearchMetadata response={results} />
                <AiSummarySection answer={results.answer} />
              </motion.div>

              {isLoggedOut && <LoggedOutSearchBanner />}

              {(activeTab === 'all' || activeTab === 'experts') && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-8"
                >
                  <VerifiedExperts experts={filteredExperts} total={filteredExperts.length} query={query} isLoggedOut={isLoggedOut} />
                </motion.div>
              )}

              {(activeTab === 'all' || activeTab === 'articles' || activeTab === 'videos') && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-8"
                >
                  <SourceList results={filteredArticles} filterFormat={activeTab === 'all' ? 'all' : activeTab === 'articles' ? 'article' : 'video'} isLoggedOut={isLoggedOut} />
                </motion.div>
              )}

              {!isLoggedOut && query && results && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="max-w-3xl mx-auto py-12 border-t border-slate-100 dark:border-slate-800"
                >
                  <SearchFeedback query={query} />
                </motion.div>
              )}
              
              {activeTab !== 'all' && totalPages > 1 && (
                <Pagination 
                  t={t}
                  currentPage={currentPage} totalPages={totalPages} totalResults={currentData.length} 
                  itemsPerPage={itemsPerPage} handlePageChange={handlePageChange} customPage={customPage} 
                  setCustomPage={setCustomPage} handleCustomPageSubmit={(e: React.FormEvent) => { e.preventDefault(); handlePageChange(parseInt(customPage)); }} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full shadow-xl"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Intelligence</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
