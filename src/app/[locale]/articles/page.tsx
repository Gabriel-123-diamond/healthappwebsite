'use client';

import React, { useEffect, useState } from 'react';
import { getArticles, Article } from '@/services/articleService';
import { ArrowRight, BookOpen, Loader2, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
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
      case 'A': return 'bg-green-100 text-green-700';
      case 'B': return 'bg-blue-100 text-blue-700';
      case 'C': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{t.articles.title}</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">{t.articles.subtitle}</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="h-48 bg-slate-100 relative">
                  {/* Placeholder pattern */}
                  <div className="absolute inset-0 opacity-10 bg-blue-600" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      article.category === 'Medical' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                    }`}>
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${getGradeColor(article.evidenceGrade)}`}>
                      <ShieldCheck className="w-3 h-3" /> {t.articles.grade} {article.evidenceGrade}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{article.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">{article.summary}</p>
                  
                  <Link 
                    href={`/article/${article.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all"
                  >
                    {t.articles.readMore} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
