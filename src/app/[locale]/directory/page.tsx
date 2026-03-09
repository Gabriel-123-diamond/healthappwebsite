'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getExperts, getExpertsNearby, getExpertById } from '@/services/directoryService';
import { verifyAccessCode } from '@/services/expertDashboardService';
import { PublicExpert } from '@/types/expert';
import { Loader2, ChevronLeft, Search, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useUserAuth } from '@/hooks/useUserAuth';
import { RestrictedPage } from '@/components/common/RestrictedPage';
import { ExpertCardSkeleton } from '@/components/ui/Skeleton';
import ScrollToTop from '@/components/common/ScrollToTop';
import NiceModal from '@/components/common/NiceModal';

// Extracted Components
import { ExpertCard } from '@/components/directory/ExpertCard';
import { DirectoryFilters } from '@/components/directory/DirectoryFilters';
import { DirectoryPagination } from '@/components/directory/DirectoryPagination';
import { UnlockSuccessModal } from '@/components/directory/UnlockSuccessModal';
import { AuthBanner } from '@/components/directory/AuthBanner';
import { DirectoryResultsInfo } from '@/components/directory/DirectoryResultsInfo';

const ITEMS_PER_PAGE = 12;

export default function DirectoryPage() {
  const { user, loading: authLoading } = useUserAuth();
  const t = useTranslations('directoryPage');
  const searchParams = useSearchParams();
  
  // States
  const [allExperts, setAllExperts] = useState<PublicExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('filter') || '');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [showFilters, setShowFilters] = useState(!!searchParams.get('filter'));
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageInput, setCustomPageInput] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [privateExpert, setPrivateExpert] = useState<PublicExpert | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', description: '', type: 'info' as 'info' | 'warning' | 'success' });

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({ isOpen: true, title, description, type });
  };

  const handleVerifyCode = async () => {
    if (accessCode.length === 6) {
      setVerifyingCode(true);
      try {
        const codeData = await verifyAccessCode(accessCode);
        if (codeData) {
          const expert = await getExpertById(codeData.expertId);
          if (expert) {
            setPrivateExpert({ ...expert, isPrivate: true, isMe: user?.uid === expert.id });
            setShowSuccessModal(true);
          } else showAlert("Protocol Failed", "Expert record no longer exists.", "warning");
        } else showAlert("Invalid Access Code", "The code you entered is invalid or has expired.", "warning");
      } catch (error) {
        showAlert("Verification Error", "Please check your network and try again.", "warning");
      } finally {
        setVerifyingCode(false);
      }
    }
  };

  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter) { setSearchQuery(urlFilter); setShowFilters(true); }
  }, [searchParams]);

  useEffect(() => { if (accessCode.length < 6) setPrivateExpert(null); }, [accessCode]);

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        const data = nearbyOnly && userLocation ? await getExpertsNearby(userLocation, 50000) : await getExperts('all');
        setAllExperts(data);
      } catch (error) { console.error("Failed to fetch experts:", error); }
      finally { setLoading(false); }
    };
    fetchExperts();
  }, [nearbyOnly, userLocation]);

  const requestUserLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLocation([pos.coords.latitude, pos.coords.longitude]); setNearbyOnly(true); },
      () => showAlert("Location Denied", "Location access was denied.", "warning")
    );
  };

  const filteredExperts = useMemo(() => {
    if (privateExpert) return [privateExpert];
    let result = allExperts;
    if (filterType !== 'all') result = result.filter(e => e.type === filterType);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => e.name.toLowerCase().includes(q) || e.specialty.toLowerCase().includes(q));
    }
    if (selectedCountry && !nearbyOnly) {
      result = result.filter(e => e.location.toLowerCase().includes(selectedCountry.toLowerCase()));
      if (selectedState) result = result.filter(e => e.location.toLowerCase().includes(selectedState.toLowerCase()));
    }
    return result;
  }, [allExperts, filterType, searchQuery, selectedCountry, selectedState, privateExpert]);

  const totalPages = Math.ceil(filteredExperts.length / ITEMS_PER_PAGE);
  const paginatedExperts = filteredExperts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const activeFiltersCount = [filterType !== 'all', selectedCountry !== '', selectedState !== ''].filter(Boolean).length;

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (!user) return <RestrictedPage />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/5 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <button onClick={() => window.history.back()} className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Terminal
        </button>

        <div className="text-center mb-16 space-y-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-4">
            <Users className="w-3.5 h-3.5" /> {t('badge')}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">{t('title')}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">{t('subtitle')}</motion.p>
        </div>

        <DirectoryFilters 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} nearbyOnly={nearbyOnly} setNearbyOnly={setNearbyOnly} requestUserLocation={requestUserLocation}
          showFilters={showFilters} setShowFilters={setShowFilters} activeFiltersCount={activeFiltersCount} filterType={filterType} setFilterType={setFilterType}
          selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedState={selectedState} setSelectedState={setSelectedState}
          accessCode={accessCode} setAccessCode={setAccessCode} verifyingCode={verifyingCode} handleVerifyCode={handleVerifyCode} t={t}
        />

        <AuthBanner privateExpert={privateExpert} />

        <DirectoryResultsInfo 
          filteredCount={filteredExperts.length} activeFiltersCount={activeFiltersCount} searchQuery={searchQuery} t={t}
          onClearAll={() => { setFilterType('all'); setSelectedCountry(''); setSelectedState(''); setSearchQuery(''); }}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <ExpertCardSkeleton key={i} />)}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <AnimatePresence mode='popLayout'>{paginatedExperts.map(expert => <ExpertCard key={expert.id} expert={expert} t={t} />)}</AnimatePresence>
            </div>
            {filteredExperts.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6"><Search className="w-8 h-8 text-slate-300" /></div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{t('noMatches')}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{t('noMatchesDesc')}</p>
              </motion.div>
            )}
            <DirectoryPagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} customPageInput={customPageInput} setCustomPageInput={setCustomPageInput} />
          </>
        )}
      </div>
      <UnlockSuccessModal showSuccessModal={showSuccessModal} setShowSuccessModal={setShowSuccessModal} privateExpert={privateExpert} />
      <NiceModal isOpen={modalConfig.isOpen} onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} title={modalConfig.title} description={modalConfig.description} type={modalConfig.type} confirmText="Got it" />
      <ScrollToTop />
    </div>
  );
}
