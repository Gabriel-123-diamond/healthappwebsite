'use client';

import React, { useState } from 'react';
import { MessageSquare, Loader2, Send, Lock, Star } from 'lucide-react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { qaService } from '@/services/qaService';
import NiceModal from '@/components/common/NiceModal';

interface AskExpertButtonProps {
  expertId: string;
  expertName: string;
}

export default function AskExpertButton({ expertId, expertName }: AskExpertButtonProps) {
  const { profile } = useUserAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const isElite = profile?.tier === 'vip2' || profile?.tier === 'premium';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitting(true);
    try {
      await qaService.askQuestion(expertId, expertName, question);
      setIsOpen(false);
      setQuestion('');
      setModalConfig({
        isOpen: true,
        title: "Question Dispatched",
        description: `Your inquiry has been sent to ${expertName}. You will be notified once they respond.`,
        type: 'success'
      });
    } catch (error: any) {
      setModalConfig({
        isOpen: true,
        title: "Dispatch Failed",
        description: error.message || "Failed to send question.",
        type: 'warning'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isElite) {
    return (
      <div className="space-y-3">
        <button 
          disabled
          className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200 dark:border-white/5"
        >
          <Lock size={14} /> Ask Expert
        </button>
        <p className="text-[9px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-tight text-center px-4">
          Elite clinical Q&A is reserved for Premium intelligence tiers.
        </p>
      </div>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all border border-indigo-100 dark:border-indigo-500/20"
      >
        <MessageSquare size={14} /> Ask Expert
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl border border-slate-100 dark:border-white/5 overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                  <Star size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Direct Inquiry</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To: {expertName}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Clinical Inquiry</label>
                  <textarea 
                    required
                    rows={4}
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Describe your health concern in detail for the expert..."
                    className="w-full p-6 bg-slate-50 dark:bg-white/5 rounded-3xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none border-none resize-none"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    Dispatch Inquiry
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
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

      <NiceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
      />
    </>
  );
}
