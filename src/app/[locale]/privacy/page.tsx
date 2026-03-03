'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-black text-slate-900 mb-8 dark:text-white tracking-tight">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 dark:text-slate-300">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Effective Date: January 26, 2026</p>

            <p className="text-lg font-medium leading-relaxed">
              IKIKE respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect information when you use the IKIKE mobile application.
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">1. Information We Collect</h2>
              <p className="leading-relaxed">
                IKIKE collects limited information to provide and improve the app experience. This may include search queries related to health topics, feedback messages, device information, usage data, approximate location for hospital listings, and anonymous analytics data. IKIKE does not collect or store medical records, diagnoses, prescriptions, or treatment histories.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">2. How We Use Information</h2>
              <p className="leading-relaxed">
                Information collected is used to provide relevant health information links, improve app performance, display nearby medical experts and hospitals, ensure security, and analyze anonymous usage trends.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">3. Third-Party Services</h2>
              <p className="leading-relaxed">
                IKIKE may use third-party services such as analytics providers, advertising networks, and external platforms including video and search services. These third parties operate under their own privacy policies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">4. Data Sharing</h2>
              <p className="leading-relaxed">
                IKIKE does not sell personal data. Information may only be shared to comply with legal obligations, protect user safety, or support app functionality.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">5. Data Security</h2>
              <p className="leading-relaxed">
                We apply reasonable technical and organizational measures to protect user data, however no digital platform can guarantee complete security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">6. Children’s Privacy</h2>
              <p className="leading-relaxed">
                IKIKE is not intended for children under the age of 13 and does not knowingly collect personal data from children.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight dark:text-white">7. Policy Updates</h2>
              <p className="leading-relaxed">
                This Privacy Policy may be updated periodically. Updates will be published within the app.
              </p>
              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">
                  Contact: <span className="text-blue-600">privacy@ikikehealth.ai</span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
