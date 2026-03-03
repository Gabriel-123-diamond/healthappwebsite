'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        <div className="bg-white p-8 sm:p-12 rounded-[40px] shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
          <h1 className="text-4xl font-black text-slate-900 mb-8 dark:text-white tracking-tight">Terms of Use</h1>
          
          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 dark:text-slate-300">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Effective Date: January 26, 2026</p>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">1. Purpose of the App</h2>
              <p className="leading-relaxed">
                IKIKE is a health information and navigation platform that provides educational content and directs users to external health resources, videos, medical experts, and healthcare facilities. IKIKE does not provide medical advice, diagnosis, or treatment.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">2. No Medical Advice</h2>
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 text-amber-900 font-medium dark:bg-amber-900/10 dark:border-amber-900/20 dark:text-amber-200">
                <p className="leading-relaxed">
                  All information provided through IKIKE is for educational and informational purposes only and must not be considered a substitute for professional medical advice, diagnosis, treatment, or emergency care.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">3. User Responsibility</h2>
              <p className="leading-relaxed">
                Users are responsible for their health decisions and agree to consult qualified healthcare professionals for medical concerns.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">4. External Content</h2>
              <p className="leading-relaxed">
                IKIKE links to third-party websites and platforms. IKIKE does not control or guarantee the accuracy of external content.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">5. Herbal & Traditional Information</h2>
              <p className="leading-relaxed">
                Information on herbs and traditional practices is shared for educational and cultural awareness only. IKIKE does not provide dosage, preparation methods, or treatment recommendations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">6. Limitation of Liability</h2>
              <p className="leading-relaxed">
                IKIKE and its operators are not liable for health decisions, outcomes, or actions taken based on information accessed through the app.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">7. Modifications & Termination</h2>
              <p className="leading-relaxed">
                IKIKE reserves the right to modify these Terms or suspend access if misuse occurs.
              </p>
              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">
                  Contact: <span className="text-blue-600">support@ikikehealth.ai</span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
