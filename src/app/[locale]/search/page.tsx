'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, MapPin, Calendar, ArrowRight, PlayCircle, FileText, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { searchHealthTopic, AIResponse } from '@/services/aiService';
import Link from 'next/link';
import { countries } from '@/lib/countries';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialMode = (searchParams.get('mode') as 'medical' | 'herbal' | 'both') || 'both';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [activeTab, setActiveTab] = useState<'all' | 'experts' | 'articles' | 'videos'>('all');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState(''); // Text input for now as states aren't in lib
  const [distanceRange, setDistanceRange] = useState(50);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [customPage, setCustomPage] = useState('');

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    setCurrentPage(1); // Reset to page 1 on new search
    try {
      const data = await searchHealthTopic(searchQuery, initialMode);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}&mode=${initialMode}`);
  };

  // Filter Logic
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

  // Pagination Logic
  const currentData = activeTab === 'experts' ? filteredExperts : filteredArticles;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  
  const paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setCustomPage('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCustomPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(customPage);
    if (!isNaN(pageNum)) {
      handlePageChange(pageNum);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Search Results</h1>
          </div>

          <form onSubmit={onSearchSubmit} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search health topics..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
              {['all', 'experts', 'articles', 'videos'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab as any); setCurrentPage(1); }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                    activeTab === tab 
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

            {/* Country Filter */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-transparent border-none text-sm text-slate-700 dark:text-slate-300 focus:ring-0 w-32 cursor-pointer"
              >
                <option value="">All Countries</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name.charAt(0).toUpperCase() + c.name.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5">
              <input
                type="text"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                placeholder="State/City..."
                className="bg-transparent border-none text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:ring-0 w-32"
              />
            </div>

            {/* Range Slider */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase">Range</span>
              <input
                type="range"
                min="5"
                max="500"
                value={distanceRange}
                onChange={(e) => setDistanceRange(Number(e.target.value))}
                className="w-24 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-12 text-right">{distanceRange} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-500">Searching specifically for "{query}"...</p>
          </div>
        ) : !results ? (
          <div className="text-center py-20">
            <p className="text-slate-500">Enter a topic to start searching.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              
              {/* Left Column: Experts (only show if 'all' or 'experts' tab is active) */}
              {(activeTab === 'all' || activeTab === 'experts') && (
                <div className={`${activeTab === 'experts' ? 'lg:col-span-3' : 'lg:col-span-1'} space-y-6`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Experts ({filteredExperts.length})
                    </h2>
                  </div>

                  <div className={`grid gap-4 ${activeTab === 'experts' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
                    {(activeTab === 'experts' ? paginatedData : filteredExperts.slice(0, 5)).map((expert: any) => (
                      <div key={expert.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                            {expert.name[0]}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{expert.name}</h3>
                            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">{expert.specialty}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {expert.location}
                            </p>
                          </div>
                        </div>
                        <Link 
                          href={`/expert/${expert.id}`}
                          className="mt-4 block w-full py-2 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-center rounded-lg text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        >
                          View Profile
                        </Link>
                      </div>
                    ))}
                    {filteredExperts.length === 0 && (
                      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center col-span-full">
                        <p className="text-slate-500 text-sm">No experts found matching your filters.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Right Column: Content */}
              <div className={`${(activeTab === 'all') ? 'lg:col-span-2' : (activeTab === 'experts' ? 'hidden' : 'lg:col-span-3')} space-y-6`}>
                {(activeTab === 'all' || activeTab === 'articles' || activeTab === 'videos') && (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        Trusted Sources ({filteredArticles.length})
                      </h2>
                    </div>

                    <div className="grid gap-4">
                      {(activeTab === 'all' ? filteredArticles : paginatedData).map((result: any) => (
                        <a 
                          key={result.id}
                          href={result.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                  result.format === 'video' 
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                }`}>
                                  {result.format}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">{result.source}</span>
                              </div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {result.title}
                              </h3>
                              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                {result.summary}
                              </p>
                              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                            {result.format === 'video' && (
                              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                <PlayCircle className="w-10 h-10 text-slate-400" />
                              </div>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Pagination Controls (Only show if not in 'all' view, or handle 'all' view pagination separately if needed) */}
            {activeTab !== 'all' && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, currentData.length)}</span> of <span className="font-bold">{currentData.length}</span> results
                </p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Logic to show ranges like 1, 2, 3 ... 10 could be added here
                      // For now simpler 1-5 logic or pure sequential
                      let p = i + 1;
                      if (totalPages > 5 && currentPage > 3) {
                         p = currentPage - 3 + i;
                      }
                      if (p > totalPages) return null;
                      
                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                            currentPage === p
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </button>
                </div>

                <form onSubmit={handleCustomPageSubmit} className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Go to page</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={customPage}
                    onChange={(e) => setCustomPage(e.target.value)}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-center focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>}>
      <SearchContent />
    </Suspense>
  );
}
