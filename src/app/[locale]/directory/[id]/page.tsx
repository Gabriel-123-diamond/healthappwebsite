import React from 'react';
import { getExpertByIdServer } from '@/services/directoryServiceServer';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import ExpertHeader from '@/components/expert/ExpertHeader';
import ExpertServicesList from '@/components/expert/ExpertServicesList';
import ExpertContactCard from '@/components/expert/ExpertContactCard';
import { ChevronLeft, Info, FileText, ShieldCheck } from 'lucide-react';

export default async function ExpertDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params object before accessing properties
  const { id } = await params;
  const expert = await getExpertByIdServer(id);

  if (!expert) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors pt-24 sm:pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-10">
          <Link href="/directory" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Registry Directory
          </Link>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-3xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
          <ExpertHeader 
            name={expert.name} 
            type={expert.type} 
            specialty={expert.specialty} 
            rating={expert.rating} 
            verified={expert.verified} 
          />

          {/* Content */}
          <div className="p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
            <div className="lg:col-span-7 space-y-12 sm:space-y-16">
              {/* About Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                    <Info size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Clinical Profile</h2>
                </div>
                
                <div className="relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-full" />
                  <p className="pl-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {expert.name} is a leading specialist in {expert.specialty} with over 15 years of clinical practice. 
                    Their work focuses on integrating precision medical science with evidence-based traditional wisdom to provide holistic patient outcomes.
                  </p>
                </div>
              </section>

              {/* Services Section */}
              <ExpertServicesList />

              {/* Verified Credentials Summary */}
              <section className="p-8 rounded-[32px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-6">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-blue-600">
                  <FileText size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Academic Integrity</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    This expert has completed rigorous credentialing verification. Their medical license, board certifications, and clinical experience have been manually reviewed by the Ikiké Health Registry.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Credentialing Verified</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar Contact */}
            <div className="lg:col-span-5">
              <div className="sticky top-32">
                <ExpertContactCard 
                  location={expert.location} 
                  expertId={expert.id} 
                  expertName={expert.name} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
