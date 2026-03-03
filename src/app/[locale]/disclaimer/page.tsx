'use client';

import React from 'react';
import { ShieldAlert, Search, Leaf, Siren, Stethoscope, ChevronLeft } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

export default function DisclaimerPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Legal Disclaimers</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Please read these disclaimers carefully. They govern the use of specific features and information within the IKIKE platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Global Disclaimer */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden group">
              <div className="bg-amber-500 p-6 flex items-center gap-4 text-white">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Global</h2>
              </div>
              <div className="p-8 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                <p>
                  IKIKE provides health information for educational purposes only. It does not diagnose, treat, or replace professional medical advice. Always consult a qualified healthcare professional.
                </p>
              </div>
            </div>

            {/* Search Results Disclaimer */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden group">
              <div className="bg-blue-500 p-6 flex items-center gap-4 text-white">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <Search className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Search</h2>
              </div>
              <div className="p-8 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                <p>
                  Content shown is educational and sourced from public platforms. IKIKE does not provide medical or herbal treatment advice.
                </p>
              </div>
            </div>

            {/* Herbal Information Disclaimer */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden group">
              <div className="bg-emerald-600 p-6 flex items-center gap-4 text-white">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <Leaf className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Traditional</h2>
              </div>
              <div className="p-8 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                <p>
                  Herbal and traditional information is for educational and cultural awareness only. IKIKE does not recommend herbs as treatments or provide preparation or dosage instructions.
                </p>
              </div>
            </div>

            {/* Emergency Disclaimer */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden group">
              <div className="bg-red-600 p-6 flex items-center gap-4 text-white">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <Siren className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Emergency</h2>
              </div>
              <div className="p-8 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                <p>
                  Some symptoms may require urgent medical attention. Seek immediate care from a qualified healthcare provider or emergency service.
                </p>
              </div>
            </div>
          </div>

          {/* Expert & Hospital Listings Disclaimer */}
          <div className="bg-indigo-600 p-8 sm:p-12 rounded-[40px] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="p-6 bg-white/10 rounded-[32px] backdrop-blur-xl border border-white/10">
                <Stethoscope size={48} />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-3xl font-black tracking-tight">Expert & Directory Disclaimer</h2>
                <p className="text-indigo-100 text-lg font-medium leading-relaxed max-w-2xl">
                  Listings are for informational purposes only. IKIKE does not guarantee the quality of services provided by third-party experts or facilities found in the directory.
                </p>
              </div>
            </div>
            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
