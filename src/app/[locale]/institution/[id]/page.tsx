'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getInstitutionById } from '@/services/institutionService';
import { Institution } from '@/types/institution';
import { Users, FileText, UserPlus, Loader2 } from 'lucide-react';
import InstitutionHeader from '@/components/institution/InstitutionHeader';
import AboutSection from '@/components/institution/AboutSection';
import LibrarySection from '@/components/institution/LibrarySection';
import { useLanguage } from '@/context/LanguageContext';
import ScrollToTop from '@/components/common/ScrollToTop';

export default function InstitutionPage() {
  const { id } = useParams();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (typeof id === 'string') {
      getInstitutionById(id).then(data => {
        setInstitution(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-20 text-center pt-32 sm:pt-40"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600"/></div>;
  if (!institution) return <div className="p-20 text-center pt-32 sm:pt-40">Institution not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-16">
      <InstitutionHeader institution={institution} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <AboutSection institution={institution} />

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                {t.institution.experts}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-4 hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      DR
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">Dr. Sarah Johnson</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Cardiology • 15 years exp</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                {t.institution.publications}
              </h2>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:shadow-md dark:hover:shadow-blue-900/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">{t.institution.research}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">Jan 24, 2026</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Advances in Integrative Oncology Treatments</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">A comprehensive review of herbal adjudicants in chemotherapy...</p>
                  </div>
                ))}
              </div>
            </section>

            <LibrarySection libraries={institution.library} />
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">{t.institution.stats}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{t.institution.experts}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{institution.stats.experts}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{t.institution.publications}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{institution.stats.publications}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{t.institution.followers}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{institution.stats.followers.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 dark:bg-blue-600 text-white p-6 rounded-2xl shadow-lg transition-colors">
              <h3 className="font-bold mb-2">{t.institution.contact}</h3>
              <p className="text-slate-400 dark:text-blue-100 text-sm mb-4">For appointments and inquiries.</p>
              <button className="w-full bg-blue-600 dark:bg-white dark:text-blue-600 hover:bg-blue-700 dark:hover:bg-blue-50 text-white py-3 rounded-xl font-bold transition-all">
                {t.institution.contactAction}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
