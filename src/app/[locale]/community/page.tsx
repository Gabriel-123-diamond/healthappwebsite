'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Heart, User, Send, Loader2, 
  Hash, ShieldCheck, ArrowLeft, Plus, Sparkles
} from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { communityService, CommunityPost } from '@/services/communityService';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';

const TOPICS = [
  { id: 'general-health', name: 'General Health', desc: 'Daily wellness and preventive care.' },
  { id: 'maternal-care', name: 'Maternal Care', desc: 'Pregnancy, postpartum, and child health.' },
  { id: 'nutrition', name: 'Nutrition & Diet', desc: 'Metabolic health and dietary insights.' },
  { id: 'herbal-remedies', name: 'Herbal Medicine', desc: 'Traditional and plant-based healing.' },
];

export default function CommunityPage() {
  const [activeTopic, setActiveTopic] = useState('general-health');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await communityService.getPosts(activeTopic);
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch community posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTopic]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    if (!auth.currentUser) {
      router.push('/auth/signin');
      return;
    }

    setSubmitting(true);
    try {
      const post = await communityService.createPost(activeTopic, newPost.trim());
      setPosts([post as CommunityPost, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!auth.currentUser) return;
    try {
      await communityService.likePost(postId);
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, likes: [...new Set([...p.likes, auth.currentUser!.uid])] } 
          : p
      ));
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[140px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row gap-12">
        
        {/* Left Sidebar: Topics */}
        <div className="lg:w-1/3 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-8 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm group">
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Hub Return
            </Link>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 leading-none">
              Network <span className="text-blue-600">Nodes.</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Join moderated clinical discussions. Share experiences and learn from global health intelligence.
            </p>
          </motion.div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4 mb-4">Discussion Channels</h3>
            {TOPICS.map((topic, index) => (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveTopic(topic.id)}
                className={`w-full text-left p-6 rounded-[32px] transition-all border group relative overflow-hidden ${
                  activeTopic === topic.id 
                    ? 'bg-white dark:bg-slate-900 border-blue-500/30 shadow-2xl shadow-blue-500/10' 
                    : 'bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-slate-900/60'
                }`}
              >
                {activeTopic === topic.id && (
                  <motion.div 
                    layoutId="activeTopicGlow"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" 
                  />
                )}
                <div className="flex items-center gap-4 mb-2 relative z-10">
                  <div className={`p-2 rounded-xl transition-colors ${activeTopic === topic.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                    <Hash size={18} />
                  </div>
                  <span className={`text-lg font-black uppercase tracking-tight ${activeTopic === topic.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {topic.name}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-500 pl-12 relative z-10">{topic.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Content: Feed */}
        <div className="lg:w-2/3 flex flex-col h-[calc(100vh-200px)]">
          {/* Post Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none mb-10 shrink-0 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
            <form onSubmit={handlePost} className="flex flex-col gap-6 relative z-10">
              <textarea 
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                placeholder={`Share an insight or ask a question in #${TOPICS.find(t=>t.id === activeTopic)?.name}...`}
                className="w-full p-6 bg-slate-50 dark:bg-white/[0.03] rounded-[24px] text-base font-medium focus:ring-4 focus:ring-blue-500/10 outline-none border border-transparent focus:border-blue-500/20 transition-all resize-none placeholder:text-slate-400"
                rows={3}
              />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} /> Moderated Node Active
                  </span>
                </div>
                <button 
                  type="submit"
                  disabled={submitting || !newPost.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Broadcast Signal
                </button>
              </div>
            </form>
          </motion.div>

          {/* Feed */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 gap-4"
                >
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Feed...</p>
                </motion.div>
              ) : posts.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-32 bg-white dark:bg-slate-900 rounded-[48px] border border-dashed border-slate-200 dark:border-white/10 shadow-inner"
                >
                  <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <MessageCircle size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">No signals detected</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">Be the first to broadcast an intelligence signal in this discussion node.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="feed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <AnimatePresence mode="popLayout">
                    {posts.map((post, idx) => (
                      <CommunityPostCard 
                        key={post.id}
                        post={post}
                        idx={idx}
                        currentUserId={auth.currentUser?.uid}
                        onLike={handleLike}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
