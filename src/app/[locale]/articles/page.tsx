'use client';

import React, { useEffect, useState } from 'react';
import { getArticles } from '@/services/articleService';
import { Article } from '@/types/article';
import { ArrowRight, BookOpen, Loader2, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    getArticles().then(data => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50';
      case 'B': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50';
      case 'C': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 sm:pt-32 pb-24">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <header className="mb-20 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-500/5"
          >
            <BookOpen size={14} className="animate-pulse" />
            Scientific Archive
          </motion.div>
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{t.articles.title}</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
            {t.articles.subtitle}
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fetching Documentation</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group relative h-full"
              >
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 blur-2xl rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <Link href={`/article/${article.id}`} className="block h-full">
                  <div className="relative bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                    <div className="h-56 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
                      {/* Decorative pattern */}
                      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-transparent" />
                      
                      <div className="absolute top-6 left-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${
                          article.category === 'Medical' 
                            ? 'bg-blue-600/10 text-blue-600 border-blue-500/20' 
                            : 'bg-emerald-600/10 text-emerald-600 border-emerald-500/20'
                        }`}>
                          {article.category}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                         <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-blue-600 transform scale-90 group-hover:scale-100 transition-transform duration-500">
                            <ArrowRight size={20} />
                         </div>
                      </div>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 shadow-sm ${getGradeColor(article.evidenceGrade)}`}>
                          <ShieldCheck size={12} strokeWidth={3} /> {t.articles.grade} {article.evidenceGrade}
                        </span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{article.date}</span>
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 line-clamp-3 font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity flex-1">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-3 transition-all pt-6 border-t border-slate-50 dark:border-slate-800/50">
                        {t.articles.readMore} <ArrowRight size={14} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

