'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search, HelpCircle, MessageCircle, Mail, Phone, ChevronRight, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SupportPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 sm:pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-500/5 mx-auto"
          >
            <Activity size={14} className="animate-pulse" />
            Assistance Portal
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{t.support.title}</h1>
          
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder={t.support.searchPlaceholder}
              className="w-full pl-16 pr-6 py-5 rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-2xl shadow-blue-900/5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <ContactCard 
            icon={<MessageCircle className="w-6 h-6" />} 
            title={t.support.liveChat} 
            desc="Direct line to support grid." 
            color="text-blue-600 bg-blue-50 dark:bg-blue-900/30"
          />
          <ContactCard 
            icon={<Mail className="w-6 h-6" />} 
            title={t.support.emailUs} 
            desc="24h response protocol." 
            color="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30"
          />
          <ContactCard 
            icon={<Phone className="w-6 h-6" />} 
            title={t.support.callUs} 
            desc="Mon-Fri, 09:00 - 17:00." 
            color="text-purple-600 bg-purple-50 dark:bg-purple-900/30"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-3xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.support.faq}</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Automated Intelligence Base</p>
            </div>
          </div>
          
          <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {[
              "How do I verify my expert profile?",
              "Is my health data private?",
              "How does the AI search work?",
              "Can I export my journal data?"
            ].map((q, i) => (
              <button key={i} className="w-full flex items-center justify-between p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group">
                <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors text-lg tracking-tight">{q}</span>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronRight size={18} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 text-center shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all cursor-pointer group"
    >
      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-inner ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}