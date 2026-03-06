'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getArticleById } from '@/services/articleService';
import { Article } from '@/types/article';
import { ChevronLeft, Calendar, User, ShieldCheck, Tag, Loader2, BookOpen, Share2, Printer, Bookmark, Lock, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import ScrollToTop from '@/components/common/ScrollToTop';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedOut(!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof id === 'string') {
      getArticleById(id).then(data => {
        setArticle(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 pt-32 sm:pt-40">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600"/>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Scientific Data</p>
      </div>
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 pt-32 sm:pt-40">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-300">
          <BookOpen size={40} />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Documentation Not Found</h3>
        <Link href="/articles" className="text-blue-600 font-bold hover:underline">Return to Research</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.07]">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <Link href="/articles" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Archive Research
          </Link>

          <div className="flex items-center gap-3">
            <ActionButton icon={<Share2 size={14} />} />
            <ActionButton icon={<Bookmark size={14} />} />
            <ActionButton icon={<Printer size={14} />} />
          </div>
        </div>

        {/* Article Container */}
        <div className="relative">
          <article className={`bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-3xl shadow-blue-900/5 overflow-hidden ${isLoggedOut ? 'blur-[12px] select-none pointer-events-none' : ''}`}>
            {/* Hero Header */}
            <header className="p-8 sm:p-12 md:p-16 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                  article.category === 'Medical' 
                    ? 'bg-blue-600/10 text-blue-600 border-blue-500/30' 
                    : 'bg-emerald-600/10 text-emerald-600 border-emerald-500/30'
                }`}>
                  {article.category}
                </span>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Evidence Level {article.evidenceGrade}</span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter leading-[0.95]">
                {article.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-8 text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
                    {article.author.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Lead Investigator</span>
                    <span className="font-bold text-slate-900 dark:text-white">{article.author}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <Calendar size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Publication Date</span>
                    <span className="font-bold text-slate-900 dark:text-white">{article.date}</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Core Content */}
            <div className="p-8 sm:p-12 md:p-16 lg:p-20">
              <div className="prose prose-slate prose-lg sm:prose-xl max-w-none dark:prose-invert text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <ReactMarkdown
                  components={{
                    p: ({children}) => <p className="mb-8 last:mb-0">{children}</p>,
                    h2: ({children}) => <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-12 mb-6 tracking-tight">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4 tracking-tight">{children}</h3>,
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-blue-600 pl-8 my-10 italic text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 p-8 rounded-r-3xl">
                        {children}
                      </blockquote>
                    ),
                    ul: ({children}) => <ul className="space-y-4 my-8">{children}</ul>,
                    li: ({children}) => <li className="flex items-start gap-4"><div className="mt-3 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />{children}</li>
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <Tag size={16} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Research Index Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold border border-slate-100 dark:border-slate-700 hover:border-blue-500/30 transition-all cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {isLoggedOut && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-white/10 dark:bg-slate-950/10 backdrop-blur-[4px]" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-12 rounded-[40px] border border-white dark:border-slate-800 shadow-2xl text-center max-w-lg mx-auto"
              >
                <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30">
                  <Lock className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-4 leading-none">
                  Content <span className="text-blue-600">Restricted.</span>
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                  Full intelligence records and scientific documentation are exclusively available to platform members.
                </p>
                <Link href="/auth/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 dark:hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                  Unlock Full Record <ChevronRight size={16} strokeWidth={3} />
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Clinical Disclaimer Sidebar/Bottom */}
        <div className="mt-12 p-8 rounded-[32px] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex items-start gap-6 shadow-sm">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 shrink-0">
            <BookOpen size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest text-xs">Educational Protocol</h4>
            <p className="text-sm text-amber-800/80 dark:text-amber-400/80 font-medium leading-relaxed italic">
              This intelligence record is provided for clinical educational purposes only. It is not intended to replace professional medical diagnosis, treatment, or advice. Always consult with a verified healthcare professional before making health-related decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-500/30 transition-all shadow-sm active:scale-95">
      {icon}
    </button>
  );
}
