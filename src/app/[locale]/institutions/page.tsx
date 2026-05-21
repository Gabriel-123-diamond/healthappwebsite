'use client';

import React, { useEffect, useState } from 'react';
import { getInstitutions } from '@/services/institutionService';
import { Institution } from '@/types/institution';
import { Building2, MapPin, BadgeCheck, ArrowRight, Loader2, Search, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ScrollToTop from '@/components/common/ScrollToTop';
import Image from 'next/image';

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations();
  const router = useRouter();

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-32 sm:pt-40 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-[#0B1221] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Go Back
        </button>

        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">Health Institutions</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
            Discover verified hospitals, research universities, and clinics dedicated to advancing medical and herbal knowledge within our clinical network.
          </p>
        </header>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name, location, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 dark:text-white font-bold"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#0B1221] rounded-[40px] border border-slate-200 dark:border-white/5 border-dashed">
            <Building2 size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No institutions found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((inst, index) => (
              <InstitutionCard key={inst.id} inst={inst} index={index} />
            ))}
          </div>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
}

function InstitutionCard({ inst, index }: { inst: Institution, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-[#0B1221] rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-blue-500/10 transition-all group relative flex flex-col overflow-hidden"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="w-16 h-16 relative rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center overflow-hidden border border-blue-100 dark:border-blue-800">
          {inst.logoUrl ? (
            <Image src={inst.logoUrl} alt={inst.name} fill className="object-cover" unoptimized />
          ) : (
            <Building2 className="w-8 h-8 text-blue-600" />
          )}
        </div>
        {inst.verified && (
          <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.1em] border border-blue-500/20">
            <BadgeCheck className="w-3.5 h-3.5" />
            Verified
          </div>
        )}
      </div>

      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate tracking-tight uppercase">
        {inst.name}
      </h3>
      
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-6 font-bold uppercase tracking-widest opacity-80">
        <MapPin className="w-3.5 h-3.5 text-blue-500" />
        {inst.location}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[10px] font-black rounded-lg uppercase tracking-wider border border-slate-200 dark:border-white/10">
          {inst.type}
        </span>
        {(inst.specialties || []).slice(0, 2).map(s => (
          <span key={s} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-lg uppercase tracking-wider border border-blue-100 dark:border-blue-900/30">
            {s}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 py-6 border-t border-slate-50 dark:border-white/5 mt-auto">
        <div className="text-center">
          <div className="text-base font-black text-slate-900 dark:text-white">{inst.stats?.experts || 0}</div>
          <div className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Experts</div>
        </div>
        <div className="text-center border-x border-slate-50 dark:border-white/5">
          <div className="text-base font-black text-slate-900 dark:text-white">{inst.stats?.publications || 0}</div>
          <div className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Research</div>
        </div>
        <div className="text-center">
          <div className="text-base font-black text-slate-900 dark:text-white">{inst.stats?.followers || 0}</div>
          <div className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Followers</div>
        </div>
      </div>

      <Link href={`/institutions/${inst.id}`} className="absolute inset-0 z-10" />
      
      <div className="absolute right-6 bottom-32 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 hidden lg:block">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 ring-4 ring-white dark:ring-[#0B1221]">
          <ArrowRight className="w-6 h-6 stroke-[3]" />
        </div>
      </div>
    </motion.div>
  );
}
