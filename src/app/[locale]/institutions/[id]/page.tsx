'use client';

import React, { useEffect, useState, use } from 'react';
import { getInstitutionById } from '@/services/institutionService';
import { Institution } from '@/types/institution';
import { Building2, MapPin, BadgeCheck, ExternalLink, Loader2, BookOpen, Users, FileText, ChevronRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import ExpertStatCard from '@/components/expert/ExpertStatCard';
import ScrollToTop from '@/components/common/ScrollToTop';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function InstitutionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [inst, setInst] = useState<Institution | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInstitutionById(id).then(data => {
      setInst(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );

  if (!inst) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center pt-32 sm:pt-40">
      <Building2 className="w-16 h-16 text-slate-200 mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Institution not found</h1>
      <Link href="/institutions" className="mt-4 text-blue-600 font-bold hover:underline">Back to Directory</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-32 sm:pt-40">
      {/* Hero Header */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        {inst.coverUrl ? (
          <img src={inst.coverUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-900" />
        )}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white dark:bg-slate-800 p-2 shadow-lg border border-slate-100 dark:border-slate-700 flex-shrink-0 overflow-hidden">
              {inst.logoUrl ? (
                <img src={inst.logoUrl} alt={inst.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center rounded-2xl">
                  <Building2 className="w-12 h-12 text-blue-600" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black rounded-full uppercase tracking-widest">
                  {inst.type}
                </span>
                {inst.verified && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-full uppercase tracking-widest">
                    <BadgeCheck className="w-4 h-4" /> Verified
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                {inst.name}
              </h1>

              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-8">
                <MapPin className="w-5 h-5 text-slate-400" />
                <span className="font-medium">{inst.location}</span>
              </div>

              <div className="flex flex-wrap gap-4">
                {inst.website && (
                  <a 
                    href={inst.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Official Website
                  </a>
                )}
                <button className="px-6 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  Contact Institution
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-10 border-t border-slate-100 dark:border-slate-800">
            <ExpertStatCard 
              icon={<Users className="w-6 h-6 text-blue-600" />} 
              label="Verified Experts" 
              value={(inst.stats?.experts || 0).toString()} 
              color="bg-blue-50 dark:bg-blue-900/20" 
            />
            <ExpertStatCard 
              icon={<FileText className="w-6 h-6 text-purple-600" />} 
              label="Research Papers" 
              value={(inst.stats?.publications || 0).toString()} 
              color="bg-purple-50 dark:bg-purple-900/20" 
            />
            <ExpertStatCard 
              icon={<Users className="w-6 h-6 text-emerald-600" />} 
              label="Global Followers" 
              value={((inst.stats?.followers || 0) / 1000).toFixed(1) + 'k'} 
              color="bg-emerald-50 dark:bg-emerald-900/20" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">About the Institution</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg whitespace-pre-line">
                {inst.description || "No description available."}
              </p>
            </section>

            {inst.library && inst.library.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <BookOpen className="text-blue-600 w-6 h-6" />
                    Knowledge Library
                  </h2>
                  <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-widest border border-amber-100">
                    <Lock className="w-3 h-3" /> Premium
                  </span>
                </div>

                <div className="space-y-4">
                  {inst.library.map((lib) => (
                    <div key={lib.id} className="group p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/30 transition-all cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{lib.title}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{lib.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Core Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {(inst.specialties || []).map(specialty => (
                  <span key={specialty} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700">
                    {specialty}
                  </span>
                ))}
              </div>
            </section>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-xl shadow-blue-500/20">
              <h3 className="text-xl font-bold mb-4">Official Verification</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                This institution has undergone our full credential validation process and is officially recognized as a trusted health authority on our platform.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <BadgeCheck className="w-7 h-7 text-white" />
                </div>
                <div className="font-black text-xs uppercase tracking-widest">Verified 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
