'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getArticleById } from '@/services/articleService';
import { Article } from '@/types/article';
import { ArrowLeft, Calendar, User, ShieldCheck, Tag, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === 'string') {
      getArticleById(id).then(data => {
        setArticle(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600"/></div>;
  if (!article) return <div className="p-20 text-center text-slate-500">Article not found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors pb-24">
      {/* Article Header */}
      <div className="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/articles" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Research
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
              article.category === 'Medical' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-100 dark:border-green-900/30">
              <ShieldCheck className="w-4 h-4" /> Evidence Grade {article.evidenceGrade}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{article.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-slate lg:prose-xl dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
