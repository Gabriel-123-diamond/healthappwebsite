'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AIResponse } from '@/services/aiService';
import ReactMarkdown from 'react-markdown';
import { Link } from '@/i18n/routing';
import { ConfidenceScore } from './search/ConfidenceScore';
import { RegionalContext } from './search/RegionalContext';
import { VerifiedExperts } from './search/VerifiedExperts';
import { SourceList } from './search/SourceList';
import { ScrollReveal } from './ui/ScrollReveal';
import { SearchFeedback } from './search/SearchFeedback';

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
  const filteredResults = response?.results.filter(result => {
    // 1. Filter by Format (All/Article/Video)
    if (filterFormat !== 'all' && result.format !== filterFormat) return false;
    
    // 2. Filter by Mode (Medical/Herbal/Both) - Client side filtering for 'Both' results
    // If the API return was for 'both', we allow filtering. If API was specific, we don't need to filter (result.type matches already)
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
          <div className="p-5 sm:p-8 border-b border-slate-100 dark:border-slate-700">
            {response.confidenceScore && (
              <ConfidenceScore score={response.confidenceScore} explanation={response.explanation} />
            )}

            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              AI Summary
            </h3>
            <div className="prose prose-slate prose-sm sm:prose-base max-w-none dark:prose-invert text-slate-700 dark:text-slate-300 leading-relaxed">
              <ReactMarkdown
                components={{
                  p: ({children}) => <ScrollReveal className="mb-4">{children}</ScrollReveal>,
                  li: ({children}) => <ScrollReveal className="mb-2"><li className="list-disc ml-4">{children}</li></ScrollReveal>,
                  h1: ({children}) => <ScrollReveal className="mt-6 mb-4"><h1 className="text-xl sm:text-2xl font-black">{children}</h1></ScrollReveal>,
                  h2: ({children}) => <ScrollReveal className="mt-6 mb-4"><h2 className="text-lg sm:text-xl font-black">{children}</h2></ScrollReveal>,
                  h3: ({children}) => <ScrollReveal className="mt-4 mb-2"><h3 className="text-base sm:text-lg font-black">{children}</h3></ScrollReveal>,
                }}
              >
                {response.answer}
              </ReactMarkdown>
            </div>
          </div>

          {response.regionalContext && (
            <RegionalContext 
              region={response.regionalContext.region} 
              insight={response.regionalContext.insight} 
            />
          )}

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

          {query && filteredResults.length > 0 && (
            <div className="p-5 sm:p-8 pt-0 bg-slate-50 dark:bg-slate-900/50 flex justify-center">
              <Link
                href={`/search?q=${encodeURIComponent(query)}&mode=${mode}`}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem(`search_cache_${query}_${mode}`, JSON.stringify(response));
                  }
                }}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-200 transition-all shadow-sm active:scale-95 group"
              >
                View More Results
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-500" />
              </Link>
            </div>
          )}

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
