'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, FileText, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { searchHealthTopic } from '@/services/aiService';
import { AIResponse } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchFeedback } from '@/components/search/SearchFeedback';
import { AiSummarySection } from '@/components/search/AiSummarySection';
import { SearchMetadata } from '@/components/SearchMetadata';
import { SearchHeader } from '@/components/search/SearchHeader';
import { ExpertResultCard } from '@/components/search/ExpertResultCard';
import { SourceResultCard } from '@/components/search/SourceResultCard';
import { VerifiedExperts } from '@/components/search/VerifiedExperts';
import { SourceList } from '@/components/search/SourceList';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialMode = (searchParams.get('mode') as 'medical' | 'herbal' | 'both') || 'both';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'all' | 'experts' | 'articles' | 'videos'>('all');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [distanceRange, setDistanceRange] = useState(50);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [customPage, setCustomPage] = useState('');

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
  }, [initialQuery]);

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
  const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setCustomPage('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-24">
      <SearchHeader 
        query={query} setQuery={setQuery} onSearchSubmit={onSearchSubmit} activeTab={activeTab} 
        setActiveTab={setActiveTab} setCurrentPage={setCurrentPage} selectedCountry={selectedCountry} 
        setSelectedCountry={setSelectedCountry} selectedState={selectedState} setSelectedState={setSelectedState} 
        distanceRange={distanceRange} setDistanceRange={setDistanceRange} 
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {loading ? (
            <SearchLoading query={query} />
          ) : error ? (
            <SearchError error={error} onRetry={() => handleSearch(query)} />
          ) : !results ? (
            <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-slate-300" />
               </div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Initialize Intelligence</h3>
               <p className="text-slate-500 font-medium italic">Enter a health topic above to begin clinical synthesis.</p>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-3xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <SearchMetadata response={results} />
                <AiSummarySection answer={results.answer} />
              </div>

              {(activeTab === 'all' || activeTab === 'experts') && (
                <div className="space-y-8">
                  <VerifiedExperts experts={filteredExperts} total={filteredExperts.length} query={query} />
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'articles' || activeTab === 'videos') && (
                <div className="space-y-8">
                  <SourceList results={filteredArticles} filterFormat={activeTab === 'all' ? 'all' : activeTab === 'articles' ? 'article' : 'video'} />
                </div>
              )}

              {query && results && (
                <div className="max-w-3xl mx-auto py-12 border-t border-slate-100 dark:border-slate-800">
                  <SearchFeedback query={query} />
                </div>
              )}
              
              {activeTab !== 'all' && totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage} totalPages={totalPages} totalResults={currentData.length} 
                  itemsPerPage={itemsPerPage} handlePageChange={handlePageChange} customPage={customPage} 
                  setCustomPage={setCustomPage} handleCustomPageSubmit={(e: React.FormEvent) => { e.preventDefault(); handlePageChange(parseInt(customPage)); }} 
                />
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const SearchLoading = ({ query }: { query: string }) => (
  <motion.div key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm">
    <div className="relative mb-10">
      <motion.div 
        animate={{ rotate: 360, borderRadius: ["30%", "50%", "30%"] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }} 
        className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/20 flex items-center justify-center relative z-10"
      >
        <Sparkles className="w-10 h-10 text-white" />
      </motion.div>
      <div className="absolute inset-[-15px] border-2 border-dashed border-blue-200 dark:border-blue-900/30 rounded-full animate-spin-slow" />
    </div>
    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Ikiké is Synthesizing...</h2>
    <p className="text-slate-500 dark:text-slate-400 font-medium">Scanning archives for "{query}"</p>
  </motion.div>
);

const SearchError = ({ error, onRetry }: { error: string, onRetry: () => void }) => (
  <div className="text-center py-20">
    <div className="bg-red-50 text-red-700 p-6 rounded-2xl inline-block max-w-md border border-red-100 shadow-sm">
      <p className="font-bold mb-2">Search Failed</p>
      <p className="text-sm">{error}</p>
      <button onClick={onRetry} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors">Try Again</button>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, totalResults, itemsPerPage, handlePageChange, customPage, setCustomPage, handleCustomPageSubmit }: any) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
    <p className="text-sm text-slate-500 dark:text-slate-400">Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> to <b>{Math.min(currentPage * itemsPerPage, totalResults)}</b> of <b>{totalResults}</b> results</p>
    <div className="flex items-center gap-2">
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"><ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" /></button>
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let p = totalPages > 5 && currentPage > 3 ? currentPage - 3 + i : i + 1;
          if (p > totalPages) return null;
          return <button key={p} onClick={() => handlePageChange(p)} className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${currentPage === p ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>{p}</button>;
        })}
      </div>
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"><ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" /></button>
    </div>
    <form onSubmit={handleCustomPageSubmit} className="flex items-center gap-2"><span className="text-sm text-slate-500">Go to page</span><input type="number" min="1" max={totalPages} value={customPage} onChange={(e) => setCustomPage(e.target.value)} className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-center focus:ring-2 focus:ring-blue-500 outline-none" /></form>
  </div>
);

export default function SearchPage() {
  return <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>}><SearchContent /></Suspense>;
}
