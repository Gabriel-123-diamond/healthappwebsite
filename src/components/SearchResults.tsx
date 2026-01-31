'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Globe, Users, Info, Activity, PlayCircle, FileText } from 'lucide-react';
import { AIResponse } from '@/services/aiService';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface SearchResultsProps {
  response: AIResponse | null;
  isSearching: boolean;
  filterFormat?: 'all' | 'article' | 'video';
  query?: string; // Added optional query prop
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const getGradeColor = (grade?: string) => {
  switch (grade) {
    case 'A': return 'bg-green-100 text-green-700 border-green-200';
    case 'B': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'C': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'D': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

const SearchResults: React.FC<SearchResultsProps> = ({ response, isSearching, filterFormat = 'all', query }) => {
  // Filter results based on selected format
  const filteredResults = response?.results.filter(result => {
    if (filterFormat === 'all') return true;
    return result.format === filterFormat;
  }) || [];

  return (
    <AnimatePresence>
      {response && !isSearching && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className="text-left max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100 dark:border-slate-700">
            {response.confidenceScore && (
              <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${response.confidenceScore > 90 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">AI Confidence Score</span>
                      <span className={`text-sm font-black ${response.confidenceScore > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {response.confidenceScore}%
                      </span>
                    </div>
                    {response.explanation && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <Info className="w-3 h-3" /> {response.explanation}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${response.confidenceScore}%` }}
                    className={`h-full ${response.confidenceScore > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  />
                </div>
              </div>
            )}

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Summary
            </h3>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="prose prose-slate max-w-none dark:prose-invert text-slate-700 dark:text-slate-300 leading-relaxed"
            >
              <ReactMarkdown>
                {response.answer}
              </ReactMarkdown>
            </motion.div>
          </div>

          {response.regionalContext && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.3 }}
              className="px-8 py-6 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/30"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                  <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm uppercase tracking-wide mb-1">
                    Cultural Context: {response.regionalContext.region}
                  </h4>
                  <p className="text-indigo-800 dark:text-indigo-400 text-sm leading-relaxed">
                    {response.regionalContext.insight}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {response.directoryMatches && response.directoryMatches.length > 0 && (
            <div className="mx-8 my-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Verified Experts ({response.totalDirectoryMatches || response.directoryMatches.length})
              </h3>
              {response.directoryMatches.map((expert, idx) => (
                <motion.div 
                  key={expert.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="p-6 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{expert.name}</h4>
                      <p className="text-blue-100 text-sm">
                        {expert.specialty} • {expert.location}
                      </p>
                    </div>
                  </div>
                  <Link 
                    href={`/expert/${expert.id}`}
                    className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-50 transition-colors whitespace-nowrap"
                  >
                    View
                  </Link>
                </motion.div>
              ))}
              
              {(response.totalDirectoryMatches || 0) > 2 && (
                <Link 
                  href={`/directory?query=${encodeURIComponent(response.directoryMatches[0].specialty)}`}
                  className="text-center py-3 text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-colors border border-blue-100"
                >
                  See all {response.totalDirectoryMatches} experts
                </Link>
              )}
            </div>
          )}

          <div className="p-8 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trusted Sources ({filteredResults.length})</h3>
            </div>
            <motion.div className="grid gap-4" variants={containerVariants}>
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                <motion.a 
                  key={result.id} 
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors flex items-start gap-4 group cursor-pointer shadow-sm hover:shadow-md no-underline"
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 ${result.format === 'video' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    {result.format === 'video' ? <PlayCircle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{result.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{result.summary}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                        result.format === 'video' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {result.format === 'video' ? 'Video' : 'Article'}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                        result.type === 'medical' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {result.type === 'medical' ? 'Medical' : 'Herbal'}
                      </span>
                      {result.evidenceGrade && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border flex items-center gap-1 ${getGradeColor(result.evidenceGrade)}`}>
                          <ShieldCheck className="w-3 h-3" />
                          Grade {result.evidenceGrade}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">• {result.source}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors self-center" />
                </motion.a>
              ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No {filterFormat === 'all' ? '' : filterFormat} sources found matching your query.
                </div>
              )}
            </motion.div>

            {query && filteredResults.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-all shadow-sm group"
                >
                  View More Results
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
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
