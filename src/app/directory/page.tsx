'use client';

import React, { useState, useEffect } from 'react';
import { getExperts, Expert } from '@/services/directoryService';
import { MapPin, Star, BadgeCheck, Stethoscope, Leaf, Building2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

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

export default function DirectoryPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { t } = useLanguage();

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        const data = await getExperts(filter);
        setExperts(data);
      } catch (error) {
        console.error("Failed to fetch experts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [filter]);

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

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')} 
            label={t.directory.allExperts} 
          />
          <FilterButton 
            active={filter === 'doctor'} 
            onClick={() => setFilter('doctor')} 
            label={t.directory.doctors} 
            icon={<Stethoscope className="w-4 h-4" />} 
          />
          <FilterButton 
            active={filter === 'herbalist'} 
            onClick={() => setFilter('herbalist')} 
            label={t.directory.herbalists} 
            icon={<Leaf className="w-4 h-4" />} 
          />
          <FilterButton 
            active={filter === 'hospital'} 
            onClick={() => setFilter('hospital')} 
            label={t.directory.hospitals} 
            icon={<Building2 className="w-4 h-4" />} 
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode='wait'>
              {experts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} t={t} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon?: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-colors ${
        active 
          ? 'bg-slate-900 text-white shadow-lg dark:bg-blue-600' 
          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      {label}
    </motion.button>
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
