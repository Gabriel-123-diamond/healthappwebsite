'use client';

import React, { useState } from 'react';
import { Loader2, PenSquare, Search, HelpCircle, Activity, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useCommunity } from '@/hooks/useCommunity';
import { CommunitySidebar } from '@/components/community/CommunitySidebar';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/i18n/routing';
import ScrollToTop from '@/components/common/ScrollToTop';

export default function CommunityPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { 
    posts, loading, 
    selectedTopic, setSelectedTopic, 
    submitPost, reportPost, isPosting 
  } = useCommunity();
  
  const [newPostContent, setNewPostContent] = useState('');
  const [isQuestion, setIsQuestion] = useState(false);

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) return;
    await submitPost(newPostContent, "User", "user", isQuestion ? 'question' : 'post');
    setNewPostContent('');
    setIsQuestion(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <button 
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Sidebar - Navigation */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="sticky top-32 space-y-8">
              <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Community</h1>
                <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Clinical Network Grid</p>
              </div>
              <CommunitySidebar 
                selectedTopic={selectedTopic} 
                onTopicSelect={setSelectedTopic} 
              />
            </div>
          </div>

          {/* Main Feed */}
          <div className="flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">
            {/* Quick Post Creator */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-3xl shadow-blue-900/5 mb-12 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <PenSquare size={20} />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Initialize Discussion</h3>
              </div>

              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={`Engage the community regarding ${selectedTopic}...`}
                className="w-full bg-slate-50 dark:bg-slate-950/50 p-6 rounded-3xl border-none outline-none text-slate-900 dark:text-white resize-none h-32 placeholder:text-slate-400 font-medium text-lg leading-relaxed focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
              />
              
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-6">
                <button 
                  onClick={() => setIsQuestion(!isQuestion)}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    isQuestion 
                      ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-amber-200 hover:text-amber-600'
                  }`}
                >
                  <HelpCircle size={14} />
                  {isQuestion ? 'Help Requested' : 'Mark as Question'}
                </button>
                <button 
                  onClick={handlePostSubmit}
                  disabled={isPosting || !newPostContent.trim()}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-[20px] font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
                >
                  {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><PenSquare className="w-4 h-4" /> Broadcast Insights</>}
                </button>
              </div>
            </motion.div>

            {/* Feed Label */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Latest Activity in {selectedTopic}</span>
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* Feed Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Network</p>
              </div>
            ) : posts.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 border-dashed">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active signals in this sector</p>
                <p className="text-slate-500 text-sm mt-2 font-medium">Be the first to initialize a discussion.</p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <CommunityPostCard 
                    key={post.id} 
                    post={post} 
                    onLike={() => {}} 
                    onReport={(reason) => reportPost(post.id, reason)} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Search & Status */}
          <div className="hidden xl:block w-80">
            <div className="sticky top-32 space-y-8">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Scan discussions..." 
                  className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </div>
              
              <div className="p-8 bg-slate-900 dark:bg-blue-600 rounded-[40px] text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-blue-400" />
                    <h3 className="font-black uppercase tracking-widest text-[10px]">Registry Protocol</h3>
                  </div>
                  <p className="text-sm font-medium leading-relaxed opacity-90">
                    Maintain clinical integrity. Report misleading health advice or unauthorized diagnosis attempts.
                  </p>
                  <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Moderation Active</span>
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
