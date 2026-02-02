'use client';

import React, { useState, useEffect } from 'react';
import { getExperts } from '@/services/directoryService';
import { Expert } from '@/types/expert';
import { MapPin, Star, BadgeCheck, Stethoscope, Leaf, Building2, Loader2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSearchParams } from 'next/navigation';
import { countries } from '@/lib/countries';
import { Dropdown, DropdownOption } from '@/components/ui/Dropdown';

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

const ITEMS_PER_PAGE = 12;

export default function DirectoryPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  
  const [allExperts, setAllExperts] = useState<Expert[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const { t } = useLanguage();

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        const data = await getExperts('all');
        setAllExperts(data);
      } catch (error) {
        console.error("Failed to fetch experts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = allExperts;

    // Filter by Type
    if (filterType !== 'all') {
      result = result.filter(expert => expert.type === filterType);
    }

    // Filter by Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(expert => 
        expert.name.toLowerCase().includes(lowerQuery) || 
        expert.specialty.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by Location
    if (selectedCountry) {
      result = result.filter(expert => expert.location.includes(selectedCountry));
      if (selectedState) {
        result = result.filter(expert => expert.location.includes(selectedState));
      }
    }

    setFilteredExperts(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [allExperts, filterType, searchQuery, selectedCountry, selectedState]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredExperts.length / ITEMS_PER_PAGE);
  const paginatedExperts = filteredExperts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
          >
            {t.directory.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            {t.directory.subtitle}
          </motion.p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dropdown
              value={selectedCountry}
              onChange={(val) => { setSelectedCountry(val); setSelectedState(''); }}
              options={[
                { value: '', label: 'All Countries' },
                ...countries.map(c => ({
                  value: c.name,
                  label: c.name,
                  icon: <span>{c.flag}</span>
                }))
              ]}
              placeholder="All Countries"
              className="z-30"
            />
            
            <Dropdown
              value={selectedState}
              onChange={setSelectedState}
              options={[
                { value: '', label: 'All States/Regions' },
                { value: 'Lagos', label: 'Lagos' },
                { value: 'Abuja', label: 'Abuja' },
                { value: 'Rivers', label: 'Rivers' },
                { value: 'New York', label: 'New York' },
                { value: 'London', label: 'London' },
              ]}
              placeholder="All States/Regions"
              className="z-20"
            />

            <div className="flex gap-2">
               {/* Type Filter Buttons embedded here for cleaner layout on mobile */}
               <Dropdown
                  value={filterType}
                  onChange={setFilterType}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'doctor', label: 'Doctors' },
                    { value: 'herbalist', label: 'Herbalists' },
                    { value: 'hospital', label: 'Hospitals' },
                  ]}
                  placeholder="All Types"
                  className="w-full z-10"
               />
            </div>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              <AnimatePresence mode='wait'>
                {paginatedExperts.map((expert) => (
                  <ExpertCard key={expert.id} expert={expert} t={t} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredExperts.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                No experts found matching your criteria.
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm text-slate-500">Go to:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) setCurrentPage(page);
                    }}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-center text-sm"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ExpertCard({ expert, t }: { expert: Expert, t: any }) {
  const getIcon = () => {
    switch (expert.type) {
      case 'doctor': return <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'herbalist': return <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'hospital': return <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getBadgeColor = () => {
    switch (expert.type) {
      case 'doctor': return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'herbalist': return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      case 'hospital': return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
    }
  };

  return (
    <motion.div variants={itemVariants} layout>
      <Link href={`/directory/${expert.id}`} className="block h-full">
        <motion.div 
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-all cursor-pointer h-full"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getBadgeColor()}`}>
              {getIcon()}
            </div>
            {expert.verified && (
              <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md text-xs font-bold">
                <BadgeCheck className="w-3 h-3" />
                {t.directory.verified}
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {expert.name}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 font-medium">{expert.specialty}</p>
          
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-50 dark:border-slate-700">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              {expert.location}
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-current" />
              {expert.rating}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
