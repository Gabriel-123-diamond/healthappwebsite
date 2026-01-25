'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getQuestionById, Question } from '@/services/communityService';
import { MessageSquare, ThumbsUp, User, CheckCircle, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function QuestionDetailPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === 'string') {
      getQuestionById(id).then(data => {
        setQuestion(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600"/></div>;
  if (!question) return <div className="p-12 text-center">Question not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/community" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Link>

        {/* Question Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                <ThumbsUp className="w-6 h-6" />
              </button>
              <span className="font-bold text-lg text-slate-700">{question.likes}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600">
                  {question.category}
                </span>
                <span className="text-sm text-slate-400">
                  Posted by <span className="font-medium text-slate-700">{question.authorName}</span> • {question.timestamp}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-slate-900 mb-4">{question.title}</h1>
              <p className="text-slate-700 leading-relaxed text-lg mb-6">{question.content}</p>
              
              <div className="flex gap-2">
                {question.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            {question.answers.length} Answers
          </h2>
          
          <div className="space-y-6">
            {question.answers.map((answer) => (
              <div 
                key={answer.id} 
                className={`p-6 rounded-2xl border ${
                  answer.isVerifiedExpert 
                    ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      answer.isVerifiedExpert ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {answer.isVerifiedExpert ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{answer.authorName}</span>
                        {answer.isVerifiedExpert && (
                          <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                            Verified Expert
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{answer.timestamp}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed mb-4">{answer.content}</p>

                <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({answer.likes})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
