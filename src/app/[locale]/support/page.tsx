'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Activity, Database, MessageCircle, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { FAQAccordion, FAQItem } from '@/components/support/FAQAccordion';
import { ContactCard } from '@/components/support/ContactCard';

export default function SupportPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('/api/support/faqs');
        const data = await response.json();
        if (data.faqs) {
          setFaqs(data.faqs);
        }
      } catch (error) {
        console.error("Failed to load intelligence base:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(faqs.map(item => item.category)))];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(item => {
      const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, faqs]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      {/* Dynamic Neural Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/[0.03] blur-[140px] rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/[0.03] blur-[120px] rounded-full translate-y-1/4 -translate-x-1/4" />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] border border-slate-100 dark:border-white/5 rounded-2xl shadow-xl shadow-blue-500/5 mx-auto"
          >
            <Activity size={14} className="animate-pulse" />
            Support Grid Protocol
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight uppercase">
              How can we help <span className="text-blue-600 text-glow">you?</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
              Access the Automated Intelligence Base for instant solutions or connect directly with our support nodes.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-blue-600/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors z-10" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search diagnostic base..."
              className="w-full pl-16 pr-6 py-6 rounded-[32px] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-2xl shadow-blue-900/5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none relative z-10"
            />
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <ContactCard 
            icon={<MessageCircle className="w-6 h-6" />} 
            title="Live Chat" 
            desc="Direct line to support grid." 
            color="text-blue-600 bg-blue-50 dark:bg-blue-900/20"
          />
          <ContactCard 
            icon={<Mail className="w-6 h-6" />} 
            title="Email Support" 
            desc="support@ikikehealth.com" 
            color="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
            href="mailto:support@ikikehealth.com"
          />
          <ContactCard 
            icon={<Phone className="w-6 h-6" />} 
            title="Emergency Care" 
            desc="Dial 112 for urgent medical." 
            color="text-rose-600 bg-rose-50 dark:bg-rose-900/20"
          />
        </div>

        {/* Categories Range */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Range Filters</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">{faqs.length} Nodes Indexed</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(cat => {
              const count = cat === 'All' ? faqs.length : faqs.filter(f => f.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                    activeCategory === cat 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-500 hover:border-blue-500/30'
                  }`}
                >
                  {cat}
                  <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${activeCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Base */}
        <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-3xl shadow-blue-900/5 border border-slate-100 dark:border-white/5 overflow-hidden">
          <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-white/5 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Frequently Asked Questions</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Automated Intelligence Base</p>
            </div>
          </div>
          
          <div className="divide-y divide-slate-50 dark:divide-white/5">
            {loading ? (
              <div className="p-32 flex flex-col items-center justify-center space-y-4">
                <Activity size={40} className="text-blue-600 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Synchronizing Data Base...</p>
              </div>
            ) : filteredFaqs.length > 0 ? (
              filteredFaqs.map((item) => (
                <FAQAccordion 
                  key={item.id} 
                  item={item} 
                  isOpen={openId === item.id} 
                  onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                />
              ))
            ) : (
              <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                  <Search size={32} />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold">No diagnostic matches found for your query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
