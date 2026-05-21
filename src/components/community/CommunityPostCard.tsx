'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Heart } from 'lucide-react';
import { CommunityPost } from '@/services/communityService';

interface CommunityPostCardProps {
  post: CommunityPost;
  idx: number;
  currentUserId?: string;
  onLike: (postId: string) => void;
  onReport?: () => void;
  clickable?: boolean;
}

export function CommunityPostCard({
  post,
  idx,
  currentUserId,
  onLike,
  onReport,
  clickable = false
}: CommunityPostCardProps) {
  const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.5) }}
      className="group bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 dark:border-white/5 shadow-inner">
            <User size={20} />
          </div>
          <div>
            <p className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{post.authorName}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1 h-1 rounded-full bg-blue-500" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
              </p>
            </div>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-300">
           <Sparkles size={14} />
        </div>
      </div>
      
      <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8 whitespace-pre-wrap font-medium relative z-10">
        {post.content}
      </p>

      <div className="flex items-center gap-6 pt-6 border-t border-slate-50 dark:border-white/5 relative z-10">
        <button 
          onClick={() => onLike(post.id!)}
          className={`group/like flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${
            isLiked 
              ? 'text-rose-500 scale-110' 
              : 'text-slate-400 hover:text-rose-500'
          }`}
        >
          <div className={`p-2.5 rounded-xl transition-all ${
            isLiked 
              ? 'bg-rose-500/10' 
              : 'bg-slate-50 dark:bg-white/5 group-hover/like:bg-rose-500/10'
          }`}>
            <Heart size={16} className={isLiked ? 'fill-rose-500' : ''} />
          </div>
          <span>{post.likes.length} Support</span>
        </button>
        
        <div className="flex-1" />
        
        <div className="flex -space-x-2">
           {[1,2,3].map(i => (
             <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black">
               <User size={10} />
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
}