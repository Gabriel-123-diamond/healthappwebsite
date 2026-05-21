'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, CheckCircle2, Clock, User, 
  ArrowLeft, Loader2, ShieldCheck, Search, Filter
} from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { qaService, ExpertQuestion } from '@/services/qaService';
import NiceModal from '@/components/common/NiceModal';

export default function ExpertInquiriesPage() {
  const [questions, setQuestions] = useState<ExpertQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<ExpertQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const data = await qaService.getExpertQuestions(user.uid);
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch inquiries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !answer.trim()) return;

    setIsSubmitting(true);
    try {
      await qaService.answerQuestion(replyingTo.id!, answer);
      setQuestions(questions.map(q => 
        q.id === replyingTo.id ? { ...q, answer, status: 'answered', answeredAt: { seconds: Date.now() / 1000 } } : q
      ));
      setReplyingTo(null);
      setAnswer('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-12 space-y-4">
          <Link href="/expert/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2">
            <ArrowLeft size={12} /> Expert Console
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <MessageSquare size={24} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Clinical <span className="text-amber-500">Inquiries.</span>
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
            Respond to priority direct inquiries from Premium intelligence nodes. Your responses are recorded in the user's clinical node.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {questions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-dashed border-slate-200 dark:border-white/10 p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 mx-auto mb-6">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Queue Clear</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">You have no pending inquiries from the network.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className={`bg-white dark:bg-slate-900 p-8 rounded-[32px] border transition-all ${q.status === 'pending' ? 'border-amber-500/20 shadow-xl shadow-amber-500/5' : 'border-slate-100 dark:border-white/5 opacity-80'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{q.userName}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Patient ID: {q.userId.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${
                        q.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {q.status}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(q.createdAt?.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 mb-8">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      {q.question}
                    </p>
                  </div>

                  {q.status === 'pending' ? (
                    <button 
                      onClick={() => setReplyingTo(q)}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all"
                    >
                      <Send size={14} /> Compose Response
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        <ShieldCheck size={14} /> Expert Response Dispatched
                      </div>
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 pl-6 border-l-2 border-emerald-500/30">
                        {q.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyingTo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setReplyingTo(null)} />
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl border border-slate-100 dark:border-white/5 overflow-hidden">
              <div className="p-10">
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Response Node</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Replying to: {replyingTo.userName}</p>
                </div>

                <div className="mb-8 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 text-xs font-medium text-slate-500 leading-relaxed italic">
                  "{replyingTo.question}"
                </div>

                <form onSubmit={handleSendAnswer} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Clinical Advice</label>
                    <textarea 
                      required
                      autoFocus
                      rows={6}
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                      placeholder="Provide your professional clinical response..."
                      className="w-full p-6 bg-slate-50 dark:bg-white/5 rounded-3xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 outline-none border-none resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      Authorize & Dispatch
                    </button>
                    <button 
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
