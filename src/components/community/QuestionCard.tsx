'use client';

import React from 'react';
import { ThumbsUp, MessageSquare, CheckCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: any;
  index: number;
}

export default function QuestionCard({ question: q, index }: QuestionCardProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Medical': return 'bg-blue-100 text-blue-700';
      case 'Herbal': return 'bg-emerald-100 text-emerald-700';
      case 'Lifestyle': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-colors shadow-sm group"
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1 min-w-[60px]">
          <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl p-2 w-full">
            <ThumbsUp className="w-5 h-5 text-slate-400 mb-1" />
            <span className="font-bold text-slate-700 dark:text-slate-300">{q.likes}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
             <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getCategoryColor(q.category || q.topic || 'General')}`}>
              {q.category || q.topic || 'General'}
            </span>
            <span className="text-xs text-slate-400">• Posted by {q.authorName} • {typeof q.timestamp === 'string' ? q.timestamp : q.timestamp?.toLocaleDateString()}</span>
          </div>
          
          <Link href={`/community/${q.id}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{q.title || q.content.substring(0, 50) + '...'}</h3>
          </Link>
          <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4">{q.content}</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
              <MessageSquare className="w-4 h-4" />
              <span>{q.answerCount || q.comments || 0} Answers</span>
            </div>
            
            {q.answers?.some((a: any) => a.isVerifiedExpert) && (
              <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                <CheckCircle className="w-4 h-4" />
                <span>Expert Answered</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}