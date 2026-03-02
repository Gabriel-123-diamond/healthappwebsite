'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { AIResponse } from '@/types';
import { VerifiedExperts } from './search/VerifiedExperts';
import { SourceList } from './search/SourceList';
import { SearchFeedback } from './search/SearchFeedback';
import { bookmarkService } from '@/services/bookmarkService';
import { AiSummarySection } from './search/AiSummarySection';
import { SearchResultActions } from './search/SearchResultActions';
import { SearchMetadata } from './SearchMetadata';
import { ExpertReviewBanner } from './search/ExpertReviewBanner';
import { Variants } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { RestrictedAccessModal } from './RestrictedAccessModal';

interface SearchResultsProps {
  response: AIResponse | null;
  isSearching: boolean;
  filterFormat?: 'all' | 'article' | 'video';
  query?: string; 
  mode?: 'medical' | 'herbal' | 'both';
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const SearchResults: React.FC<SearchResultsProps> = ({ response, isSearching, filterFormat = 'all', query, mode = 'both' }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedOut(!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (query && mode && auth.currentUser) {
      bookmarkService.isSearchSaved(query, mode).then(setIsSaved);
    } else {
      setIsSaved(false);
    }
  }, [query, mode, response]);

  const handleSaveSearch = async () => {
    if (!auth.currentUser) {
      setShowModal(true);
      return;
    }
    if (!query || !mode || !response) return;
    await bookmarkService.saveSearchResponse(query, mode, response);
    setIsSaved(true);
  };

  const filteredResults = response?.results.filter(result => {
    if (filterFormat !== 'all' && result.format !== filterFormat) return false;
    if (mode !== 'both' && result.type !== mode) return false;
    return true;
  }) || [];

  return (
    <>
      <AnimatePresence mode="wait">
        {response && !isSearching && (
          <motion.div
            key="results-container"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
            className="text-left max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 overflow-hidden relative"
          >
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent pointer-events-none" />

            {/* Top Bar */}
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <Sparkles size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Intelligence Synthesis</span>
              </div>
              
              {query && (
                <button
                  onClick={handleSaveSearch}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    isSaved 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-800' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10'
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {isSaved ? 'Saved' : 'Save Insights'}
                </button>
              )}
            </div>

            <div className="p-8 sm:p-12 space-y-12">
              <SearchMetadata response={response} />

              {response.reviews && <ExpertReviewBanner reviews={response.reviews} />}

              <AiSummarySection answer={response.answer} isBlurred={isLoggedOut} />

              {response.directoryMatches && response.directoryMatches.length > 0 && (
                <div className="pt-4">
                  <VerifiedExperts 
                    experts={response.directoryMatches} 
                    total={response.totalDirectoryMatches || response.directoryMatches.length} 
                    query={query} 
                    isLoggedOut={isLoggedOut}
                  />
                </div>
              )}

              <SourceList results={filteredResults} filterFormat={filterFormat} isLoggedOut={isLoggedOut} />

              {!isLoggedOut && query && (
                <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
                  <SearchFeedback query={query} />
                </div>
              )}
            </div>

            {/* Footer Warning */}
            <div className="bg-amber-50/50 dark:bg-amber-900/10 p-6 flex items-start gap-4 border-t border-amber-100/50 dark:border-amber-900/20">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
                <AlertTriangle size={18} />
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-400/80 font-medium leading-relaxed italic">
                {response.disclaimer}
              </p>
            </div>

            <SearchResultActions query={query} mode={mode} response={response} />
          </motion.div>
        )}
      </AnimatePresence>
      <RestrictedAccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default SearchResults;
