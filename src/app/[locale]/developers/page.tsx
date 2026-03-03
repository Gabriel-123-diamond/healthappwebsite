'use client';

import React, { useState } from 'react';
import { Code2, Key, Book, Shield, Zap, Send, Loader2, CheckCircle, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { countries, Country } from '@/lib/countries';
import { Dropdown } from '@/components/ui/Dropdown';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

export default function DeveloperPortalPage() {
  const t = useTranslations('developersPage');
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries.find(c => c.name === 'united_states') || countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <button 
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-slate-900 dark:bg-black text-white py-24 px-4 overflow-hidden relative transition-colors border-b border-white/5 mx-4 sm:mx-6 lg:mx-8 rounded-[48px]">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 gap-4 h-full transform -skew-y-12 scale-150">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="h-20 border border-white/20 rounded-lg" />
            ))}
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-8"
          >
            <Code2 className="w-4 h-4" />
            {t('badge')}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            {t('title1')} <span className="text-blue-500 dark:text-blue-400">{t('title2')}</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50 dark:shadow-none">
              {t('readDoc')}
            </button>
            <a href="#request" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all border border-white/10 backdrop-blur-sm">
              {t('requestAccess')}
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <DevFeatureCard 
            icon={<Zap className="w-6 h-6 text-amber-500" />}
            title={t('feature1Title')}
            description={t('feature1Desc')}
          />
          <DevFeatureCard 
            icon={<Shield className="w-6 h-6 text-emerald-500" />}
            title={t('feature2Title')}
            description={t('feature2Desc')}
          />
          <DevFeatureCard 
            icon={<Book className="w-6 h-6 text-blue-500" />}
            title={t('feature3Title')}
            description={t('feature3Desc')}
          />
        </div>
      </div>

      {/* Request Form Section */}
      <div id="request" className="max-w-3xl mx-auto px-4 pb-24">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="p-8 md:p-12">
            {!submitted ? (
              <>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('requestFormTitle')}</h2>
                  <p className="text-slate-500 dark:text-slate-400">{t('requestFormSubtitle')}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('labelName')}</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder={t('placeholderName')} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('labelEmail')}</label>
                      <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder={t('placeholderEmail')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('labelOrg')}</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder={t('placeholderOrg')} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('labelPhone')}</label>
                      <div className="flex gap-2">
                        <div className="w-1/3">
                          <Dropdown
                            value={selectedCountry.name}
                            onChange={(val) => {
                              const c = countries.find(c => c.name === val);
                              if (c) setSelectedCountry(c);
                            }}
                            options={countries.map(c => ({
                              value: c.name,
                              label: `${c.code}`,
                              icon: <span>{c.flag}</span>
                            }))}
                            placeholder="Code"
                          />
                        </div>
                        <input
                          required
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-2/3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder={t('placeholderPhone')}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('labelUseCase')}</label>
                    <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder={t('placeholderUseCase')} />
                  </div>
                  
                  <button 
                    disabled={loading}
                    className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <Send className="w-5 h-5" />
                        {t('btnSend')}
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('successTitle')}</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
                  {t('successMsg')}
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors"
                >
                  {t('btnBack')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DevFeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:shadow-blue-900/10 transition-all">
      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
