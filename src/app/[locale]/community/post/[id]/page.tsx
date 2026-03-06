'use client';

import React, { useEffect, useState, use } from 'react';
import { communityService, CommunityPost, CommunityAnswer } from '@/services/communityService';
import { Loader2, Send, ShieldCheck, Clock, ArrowLeft } from 'lucide-react';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';
import { Link } from '@/i18n/routing';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function PostDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [post, setPost] = useState<CommunityPost | undefined>();
  const [answers, setAnswers] = useState<CommunityAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Fetch Post
    communityService.getPostById(id).then(data => {
      setPost(data);
      setLoading(false);
    });

    // 2. Stream Answers
    const unsubscribe = communityService.getAnswersStream(id, (newAnswers) => {
      setAnswers(newAnswers);
    });

    return () => unsubscribe();
  }, [id]);

  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || !post) return;
    setIsSubmitting(true);
    try {
      await communityService.submitAnswer(post.id, answerText, "Dr. Web Expert", "doctor");
      setAnswerText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40">
      <h1 className="text-2xl font-bold mb-4">Post not found</h1>
      <Link href="/community" className="text-blue-600 font-bold">Back to Community</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/community" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Discussions
        </Link>

        <CommunityPostCard post={post} onLike={() => {}} onReport={() => {}} clickable={false} />

        <div className="mt-12">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Responses ({answers.length})</h3>
          
          <div className="space-y-4 mb-32">
            {answers.length === 0 ? (
              <p className="text-center py-10 text-slate-400 font-medium italic">No answers yet. Be the first to reply!</p>
            ) : (
              answers.map(answer => (
                <div 
                  key={answer.id} 
                  className={`p-6 rounded-3xl border ${
                    answer.isExpert 
                      ? 'bg-blue-50/30 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30' 
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${answer.isExpert ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                        {answer.authorName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{answer.authorName}</span>
                          {answer.isExpert && (
                            <span className="flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded">
                              <ShieldCheck size={10} /> Expert
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {answer.timestamp.toLocaleDateString()} • {answer.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {answer.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sticky Reply Box */}
        <div className="fixed bottom-8 left-4 right-4 z-20">
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 p-3 flex items-center gap-3">
            <textarea 
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Write a response..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white resize-none h-12 py-3 px-4 placeholder:text-slate-400 font-medium"
            />
            <button 
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || !answerText.trim()}
              className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 flex-shrink-0"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
