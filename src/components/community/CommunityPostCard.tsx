'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, MoreVertical, Flag, ShieldCheck, HelpCircle } from 'lucide-react';
import { CommunityPost } from '@/services/communityService';
import { useRouter } from 'next/navigation';

interface CommunityPostCardProps {
  post: CommunityPost;
  onLike: () => void;
  onReport: (reason: string) => void;
  clickable?: boolean;
}

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({ post, onLike, onReport, clickable = true }) => {
  const isExpert = post.authorRole === 'doctor' || post.authorRole === 'herbal_practitioner' || post.authorRole === 'expert';
  const router = useRouter();

  const handleCardClick = () => {
    if (clickable) {
      router.push(`/community/post/${post.id}`);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
      className={`bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-500 group ${
        clickable ? 'cursor-pointer hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/5' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-transform duration-500 group-hover:scale-110 ${
              isExpert ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
            }`}>
              {post.authorName[0]}
            </div>
            {isExpert && (
              <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800">
                <ShieldCheck size={12} className="text-blue-600" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 dark:text-white tracking-tight">{post.authorName}</span>
              {isExpert && (
                <span className="text-[8px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">Verified Pro</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {post.timestamp.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {post.topic}
              </span>
            </div>
          </div>
        </div>
        
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-red-600 transition-all active:scale-90">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8 whitespace-pre-wrap font-medium">
        {post.content}
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800/50">
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); onLike(); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-600 rounded-xl transition-all active:scale-95 group/btn"
          >
            <Heart size={18} className="transition-transform group-active/btn:scale-125" />
            <span className="text-xs font-black">{post.likes}</span>
          </button>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-600 rounded-xl transition-all active:scale-95 group/btn"
          >
            <MessageSquare size={18} />
            <span className="text-xs font-black">{post.comments}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {post.type === 'question' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-800 text-[9px] font-black uppercase tracking-widest shadow-sm">
              <HelpCircle size={12} strokeWidth={3} />
              Open Consultation
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};