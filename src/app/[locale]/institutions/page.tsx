'use client';

import React, { useEffect, useState } from 'react';
import { getInstitutions } from '@/services/institutionService';
import { Institution } from '@/types/institution';
import { Building2, MapPin, BadgeCheck, ArrowRight, Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations();

  useEffect(() => {
    getInstitutions().then(data => {
      setInstitutions(data);
      setLoading(false);
    });
  }, []);

  const filtered = institutions.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Health Institutions</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover verified hospitals, research universities, and clinics dedicated to advancing medical and herbal knowledge.
          </p>
        </header>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, location, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
            <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No institutions found</h3>
            <p className="text-slate-500">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((inst, index) => (
              <InstitutionCard key={inst.id} inst={inst} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InstitutionCard({ inst, index }: { inst: Institution, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative flex flex-col"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center overflow-hidden border border-blue-100 dark:border-blue-800">
          {inst.logoUrl ? (
            <img src={inst.logoUrl} alt={inst.name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-8 h-8 text-blue-600" />
          )}
        </div>
        {inst.verified && (
          <div className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
            <BadgeCheck className="w-3 h-3" />
            Verified
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors truncate">
        {inst.name}
      </h3>
      
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-4 font-medium">
        <MapPin className="w-4 h-4 text-slate-400" />
        {inst.location}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded uppercase tracking-tighter">
          {inst.type}
        </span>
        {inst.specialties.slice(0, 2).map(s => (
          <span key={s} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase tracking-tighter">
            {s}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-50 dark:border-slate-800 mt-auto">
        <div className="text-center">
          <div className="text-sm font-bold text-slate-900 dark:text-white">{inst.stats.experts}</div>
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Experts</div>
        </div>
        <div className="text-center border-x border-slate-50 dark:border-slate-800">
          <div className="text-sm font-bold text-slate-900 dark:text-white">{inst.stats.publications}</div>
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Research</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-slate-900 dark:text-white">{inst.stats.followers}</div>
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Followers</div>
        </div>
      </div>

      <Link href={`/institutions/${inst.id}`} className="absolute inset-0 z-10" />
      
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 hidden lg:block">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
