'use client';

import React, { useState, useEffect } from 'react';
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
  const [filterFormat, setFilterFormat] = useState<'all' | 'article' | 'video'>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [safetyResult, setSafetyResult] = useState<SafetyCheckResult | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const result = checkSafety(query);
      if (result.hasRedFlag) {
        setSafetyResult(result);
      } else {
        setSafetyResult(null);
      }
    } else {
      setSafetyResult(null);
    }
  }, [query]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    if (!query.trim() || safetyResult?.hasRedFlag) return;

    setIsSearching(true);
    setAiResponse(null);
    setError(null);

    try {
      const response = await searchHealthTopic(query, searchMode);
      setAiResponse(response);
    } catch (err: any) {
      console.error("Search failed:", err);
      setError(err.message || "An unexpected error occurred during search.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white min-h-[600px]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 cursor-default"
          >
            <Sparkles className="w-4 h-4" />
            {t('home.heroTag')}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            {t('home.heroTitle')} <span className="text-blue-600">{t('home.heroTitleSpan')}</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            {t('home.heroSubtitle')}
          </p>
        </motion.div>

        <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto mb-8">
          <motion.div 
            className="relative group"
            transition={{ duration: 0.2 }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('common.searchPlaceholder')}
              className="w-full pl-14 pr-32 py-5 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg text-slate-900 shadow-xl"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <motion.button
              type="submit"
              disabled={isSearching || !!safetyResult?.hasRedFlag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2 ${
                (isSearching || !!safetyResult?.hasRedFlag) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
                className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-left overflow-hidden"
              >
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800 flex items-center gap-2">
                    {safetyResult.redFlagType || 'Emergency Warning'}
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    {safetyResult.message} <strong>{safetyResult.action}</strong>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <SearchModeButton 
            active={searchMode === 'medical'} 
            onClick={() => setSearchMode('medical')} 
            label={t('common.medical')} 
            icon={<Stethoscope className="w-4 h-4" />}
            colorClass="bg-blue-600"
            hoverClass="hover:border-blue-300"
          />
          <SearchModeButton 
            active={searchMode === 'herbal'} 
            onClick={() => setSearchMode('herbal')} 
            label={t('common.herbal')} 
            icon={<Leaf className="w-4 h-4" />}
            colorClass="bg-emerald-600"
            hoverClass="hover:border-emerald-300"
          />
          <SearchModeButton 
            active={searchMode === 'both'} 
            onClick={() => setSearchMode('both')} 
            label={t('common.both')} 
            icon={<Sparkles className="w-4 h-4" />}
            colorClass="bg-slate-800"
            hoverClass="hover:border-slate-400"
          />
        </div>

        {/* Content Filters */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setFilterFormat('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterFormat === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            All Results
          </button>
          <button
            onClick={() => setFilterFormat('article')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterFormat === 'article' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            Articles
          </button>
          <button
            onClick={() => setFilterFormat('video')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterFormat === 'video' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
          >
            Videos
          </button>
        </div>

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
        <SearchResults response={aiResponse} isSearching={isSearching} filterFormat={filterFormat} />
      </div>
    </section>
  );
};

function SearchModeButton({ active, onClick, label, icon, colorClass, hoverClass }: any) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
        active
          ? `${colorClass} text-white shadow-lg`
          : `bg-white text-slate-600 border border-slate-200 ${hoverClass}`
      }`}
    >
      {icon}
      {label}
    </motion.button>
  );
}

export default SearchSection;
