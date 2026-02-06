'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { AIResponse } from '@/services/aiService';
import { VerifiedExperts } from './search/VerifiedExperts';
import { SourceList } from './search/SourceList';
import { SearchFeedback } from './search/SearchFeedback';
import { bookmarkService } from '@/services/bookmarkService';
import { AiSummarySection } from './search/AiSummarySection';
import { SearchResultActions } from './search/SearchResultActions';
import { SearchMetadata } from './SearchMetadata';

interface SearchResultsProps {
  response: AIResponse | null;
  isSearching: boolean;
  filterFormat?: 'all' | 'article' | 'video';
  query?: string; 
  mode?: 'medical' | 'herbal' | 'both';
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const SearchResults: React.FC<SearchResultsProps> = ({ response, isSearching, filterFormat = 'all', query, mode = 'both' }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (query && mode) {
      bookmarkService.isSearchSaved(query, mode).then(setIsSaved);
    }
  }, [query, mode, response]);

  const handleSaveSearch = async () => {
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
    <AnimatePresence>
      {response && !isSearching && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
          exit="hidden"
          variants={containerVariants}
          className="text-left max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
        >
          {/* Header Actions */}
          <div className="p-5 sm:p-8 border-b border-slate-100 dark:border-slate-700 flex justify-end">
            {query && (
              <button
                onClick={handleSaveSearch}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSaved 
                    ? 'bg-blue-50 border-blue-100 text-blue-600' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                {isSaved ? 'Saved' : 'Save Search'}
              </button>
            )}
          </div>

          <SearchMetadata response={response} />

          <AiSummarySection answer={response.answer} />

          {response.directoryMatches && response.directoryMatches.length > 0 && (
            <VerifiedExperts 
              experts={response.directoryMatches} 
              total={response.totalDirectoryMatches || response.directoryMatches.length} 
              query={query} 
            />
          )}

          <SourceList results={filteredResults} filterFormat={filterFormat} />

          {query && (
            <div className="px-5 sm:px-8 pb-8">
              <SearchFeedback query={query} />
            </div>
          )}

          <SearchResultActions query={query} mode={mode} response={response} />

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 text-center border-t border-amber-100 dark:border-amber-900/30">
            <p className="text-xs text-amber-800 dark:text-amber-400 font-medium">
              {response.disclaimer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchResults;
