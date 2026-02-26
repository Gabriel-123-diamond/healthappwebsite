'use client';

import React, { useEffect, useState, use } from 'react';
import { communityService } from '@/services/communityService';
import { MessageSquare, ThumbsUp, User, CheckCircle, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function QuestionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [question, setQuestion] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      communityService.getPostById(id).then(data => {
        setQuestion(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-12 text-center bg-slate-50 min-h-screen"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600"/></div>;
  if (!question) return <div className="p-12 text-center">Discussion not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/community" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors font-bold">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Link>

        {/* Post Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors">
                <ThumbsUp className="w-6 h-6" />
              </button>
              <span className="font-bold text-lg text-slate-700">{question.likes}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {question.topic}
                </span>
                <span className="text-sm text-slate-400">
                  Posted by <span className="font-medium text-slate-700 dark:text-slate-300">{question.authorName}</span> • {question.timestamp.toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg mb-6 whitespace-pre-wrap">{question.content}</p>
            </div>
          </div>
        </div>

        {/* Answers placeholder - This page might be redundant with the new post/[id] page */}
        <div className="p-8 bg-blue-50 rounded-2xl text-center text-blue-600 font-bold border border-blue-100">
          This is an archived discussion view.
          <Link href={`/community/post/${id}`} className="block mt-2 underline">View active discussion</Link>
        </div>
      </div>
    </div>
  );
}