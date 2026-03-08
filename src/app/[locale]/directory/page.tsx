'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getExperts, getExpertsNearby, getExpertById } from '@/services/directoryService';
import { verifyAccessCode } from '@/services/expertDashboardService';
import { PublicExpert } from '@/types/expert';
import { MapPin, Star, BadgeCheck, Stethoscope, Leaf, Building2, Loader2, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X, Navigation, Users, Key, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { countries } from '@/lib/countries';
import { Dropdown } from '@/components/ui/Dropdown';
import { useUserAuth } from '@/hooks/useUserAuth';
import { RestrictedPage } from '@/components/common/RestrictedPage';
import { ExpertCardSkeleton } from '@/components/ui/Skeleton';
import ScrollToTop from '@/components/common/ScrollToTop';

const ITEMS_PER_PAGE = 12;

export default function DirectoryPage() {
  const { user, loading: authLoading } = useUserAuth();
  const t = useTranslations('directoryPage');
  const searchParams = useSearchParams();
  
  // Suggested filter from Symptom Checker
  const urlFilter = searchParams.get('filter') || '';
  
  const [allExperts, setAllExperts] = useState<PublicExpert[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState(urlFilter); // Initialize with URL filter
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [showFilters, setShowFilters] = useState(!!urlFilter); // Show filters if we have an active one
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageInput, setCustomPageInput] = useState('');

  // Access Code State
  const [accessCode, setAccessCode] = useState('');
  const [privateExpert, setPrivateExpert] = useState<PublicExpert | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const handleVerifyCode = async () => {
    if (accessCode.length === 6) {
      setVerifyingCode(true);
      try {
        const codeData = await verifyAccessCode(accessCode);
        if (codeData) {
          const expert = await getExpertById(codeData.expertId);
          if (expert) {
            const isMe = user?.uid === expert.id;
            setPrivateExpert({ ...expert, isPrivate: true, isMe });
            alert("Protocol established. Private clinical entry unlocked.");
          } else {
            setPrivateExpert(null);
            alert("Protocol failed. Expert record no longer exists.");
          }
        } else {
          setPrivateExpert(null);
          alert("Invalid or expired access code.");
        }
      } catch (error) {
        console.error("Error verifying access code:", error);
        setPrivateExpert(null);
        alert("Verification error. Please check your network and try again.");
      } finally {
        setVerifyingCode(false);
      }
    }
  };

  // Sync searchQuery with URL filter if it changes
  useEffect(() => {
    if (urlFilter) {
      setSearchQuery(urlFilter);
      setShowFilters(true);
    }
  }, [urlFilter]);

  // Clear private expert if code is deleted or shortened
  useEffect(() => {
    if (accessCode.length < 6) {
      setPrivateExpert(null);
    }
  }, [accessCode]);

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        let data: PublicExpert[] = [];
        
        if (nearbyOnly && userLocation) {
          data = await getExpertsNearby(userLocation, 50000); // 50km radius
        } else {
          data = await getExperts('all');
        }
        
        setAllExperts(data);
      } catch (error) {
        console.error("Failed to fetch experts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, [nearbyOnly, userLocation]);

  const requestUserLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setNearbyOnly(true);
      },
      (err) => {
        console.error(err);
        alert("Location access denied.");
      }
    );
  };

  const filteredExperts = useMemo(() => {
    if (privateExpert) {
      return [privateExpert];
    }

    let result = allExperts;

    if (filterType !== 'all') {
      result = result.filter(expert => expert.type === filterType);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(expert => 
        expert.name.toLowerCase().includes(lowerQuery) || 
        expert.specialty.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCountry && !nearbyOnly) {
      result = result.filter(expert => expert.location.toLowerCase().includes(selectedCountry.toLowerCase()));
      if (selectedState) {
        result = result.filter(expert => expert.location.toLowerCase().includes(selectedState.toLowerCase()));
      }
    }

    return result;
  }, [allExperts, filterType, searchQuery, selectedCountry, selectedState]);

  const totalPages = Math.ceil(filteredExperts.length / ITEMS_PER_PAGE);
  const paginatedExperts = filteredExperts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFiltersCount = [
    filterType !== 'all',
    selectedCountry !== '',
    selectedState !== ''
  ].filter(Boolean).length;

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (!user) return <RestrictedPage />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={() => window.history.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-4"
          >
            <Users className="w-3.5 h-3.5" />
            {t('badge')}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            {t('title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Search & Filter Bar */}
        <div className="sticky top-24 z-40 mb-12">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white dark:border-slate-800 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-900 dark:text-white"
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => nearbyOnly ? setNearbyOnly(false) : requestUserLocation()}
                className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${
                  nearbyOnly
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <Navigation className={`w-4 h-4 ${nearbyOnly ? 'fill-current' : ''}`} />
                {t('nearby')}
              </button>

              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t('filters')}
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center text-[10px]">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('profType')}</label>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'doctor', 'herbal_practitioner', 'hospital'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFilterType(type)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            filterType === type 
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {type === 'all' ? t('all') : type === 'herbal_practitioner' ? t('herbal') : t(type)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('country')}</label>
                    <Dropdown
                      value={selectedCountry}
                      onChange={(val) => { setSelectedCountry(val); setSelectedState(''); }}
                      options={[
                        { value: '', label: t('allCountries') },
                        ...countries.map(c => ({
                          value: c.name,
                          label: c.name,
                        }))
                      ]}
                      placeholder={t('selectCountry')}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('stateRegion')}</label>
                    <input 
                      type="text"
                      placeholder={t('placeholderState')}
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none font-bold text-sm text-slate-900 dark:text-white transition-colors"
                    />
                  </div>

                  <div className="space-y-3 md:col-span-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 ml-1 flex items-center gap-2">
                      <Key className="w-3 h-3" /> Private Clinical Access
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1 max-w-md">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit Private Access Code"
                          value={accessCode}
                          onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-amber-500 outline-none transition-all font-black tracking-[0.3em] text-lg text-slate-900 dark:text-white placeholder:tracking-normal placeholder:text-xs placeholder:font-bold"
                        />
                      </div>
                      <button
                        onClick={handleVerifyCode}
                        disabled={accessCode.length !== 6 || verifyingCode}
                        className="px-8 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 min-w-[140px] shadow-lg shadow-amber-500/20 disabled:shadow-none"
                      >
                        {verifyingCode ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Key className="w-4 h-4" />
                            Unlock Node
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Unlocks direct access to private expert profiles</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Auth Banner */}
        <AnimatePresence>
          {privateExpert && privateExpert.isMe && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-500/5"
            >
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                  <BadgeCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Authenticated as Owner</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">You are viewing your own private clinical entry</p>
                </div>
              </div>
              <Link 
                href="/expert/dashboard"
                className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                Go to Dashboard
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Info */}
        <div className="mb-8 flex justify-between items-center px-2">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {t('showing')} <span className="text-slate-900 dark:text-white">{filteredExperts.length}</span> {t('professionals')}
          </p>
          {(activeFiltersCount > 0 || searchQuery !== '') && (
            <button 
              onClick={() => {
                setFilterType('all');
                setSelectedCountry('');
                setSelectedState('');
                setSearchQuery('');
              }}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
            >
              <X className="w-3 h-3" /> {t('clearAll')}
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <ExpertCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <AnimatePresence mode='popLayout'>
                {paginatedExperts.map((expert) => (
                  <ExpertCard key={expert.id} expert={expert} t={t} />
                ))}
              </AnimatePresence>
            </div>

            {filteredExperts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800"
              >
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{t('noMatches')}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{t('noMatchesDesc')}</p>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {(() => {
                      const pages = [];
                      const showEllipsis = totalPages > 7;
                      
                      if (!showEllipsis) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        if (currentPage <= 4) {
                          for (let i = 1; i <= 5; i++) pages.push(i);
                          pages.push('...');
                          pages.push(totalPages);
                        } else if (currentPage >= totalPages - 3) {
                          pages.push(1);
                          pages.push('...');
                          for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                        } else {
                          pages.push(1);
                          pages.push('...');
                          pages.push(currentPage - 1);
                          pages.push(currentPage);
                          pages.push(currentPage + 1);
                          pages.push('...');
                          pages.push(totalPages);
                        }
                      }

                      return pages.map((p, i) => (
                        p === '...' ? (
                          <span key={`ellipsis-${i}`} className="w-10 text-center text-slate-400 font-black">...</span>
                        ) : (
                          <button
                            key={`page-${p}`}
                            onClick={() => {
                              setCurrentPage(Number(p));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${
                              currentPage === p
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-slate-50 hover:border-blue-500/50'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      ));
                    })()}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Jump to</span>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = parseInt(customPageInput);
                      if (val >= 1 && val <= totalPages) {
                        setCurrentPage(val);
                        setCustomPageInput('');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="relative"
                  >
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={customPageInput}
                      onChange={(e) => setCustomPageInput(e.target.value)}
                      placeholder={currentPage.toString()}
                      className="w-16 px-3 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center font-black text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-300"
                    />
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ExpertCard({ expert, t }: { expert: PublicExpert, t: any }) {
  const getIcon = () => {
    switch (expert.type) {
      case 'doctor': return <Stethoscope className="w-5 h-5" />;
      case 'herbal_practitioner': return <Leaf className="w-5 h-5" />;
      case 'hospital': return <Building2 className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const colors = {
    doctor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    herbal_practitioner: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    hospital: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800',
    other: 'text-slate-600 bg-slate-50 dark:bg-slate-900/20 dark:text-slate-400 border-slate-100 dark:border-slate-800',
  };

  const typeColor = colors[expert.type as keyof typeof colors] || colors.other;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/directory/${expert.id}`} className="block h-full">
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full">
          <div className="flex justify-between items-start mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${typeColor}`}>
              {getIcon()}
            </div>
            <div className="flex flex-col items-end gap-2">
              {expert.isMe && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white border border-blue-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 animate-pulse">
                  <Users className="w-3.5 h-3.5" />
                  This is You
                </div>
              )}
              {expert.isPrivate && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white border border-amber-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                  <Shield className="w-3.5 h-3.5" />
                  Private Result
                </div>
              )}
              {expert.verificationStatus === 'verified' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 text-[10px] font-black uppercase tracking-widest">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {t('verified')}
                </div>
              )}
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg border border-amber-100 dark:border-amber-800">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-black">{expert.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-blue-600 transition-colors capitalize">
              {expert.name}
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              {expert.specialty}
            </p>
          </div>
          
          <div className="pt-6 border-t border-slate-50 dark:border-slate-800 mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold truncate max-w-[150px]">{expert.location}</span>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500">
              <ChevronRight className="w-5 h-5 text-white dark:text-slate-900" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
