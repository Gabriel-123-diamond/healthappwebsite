'use client';

import React from 'react';
import { ThumbsUp, MessageSquare, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Question } from '@/services/communityService';

interface QuestionCardProps {
  question: Question;
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
      className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors shadow-sm group"
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1 min-w-[60px]">
          <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-2 w-full">
            <ThumbsUp className="w-5 h-5 text-slate-400 mb-1" />
            <span className="font-bold text-slate-700">{q.likes}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
             <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getCategoryColor(q.category)}`}>
              {q.category}
            </span>
            <span className="text-xs text-slate-400">• Posted by {q.authorName} • {q.timestamp}</span>
          </div>
          
          <Link href={`/community/${q.id}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{q.title}</h3>
          </Link>
          <p className="text-slate-600 text-sm line-clamp-2 mb-4">{q.content}</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
              <MessageSquare className="w-4 h-4" />
              <span>{q.answerCount} Answers</span>
            </div>
            
            {q.answers.some(a => a.isVerifiedExpert) && (
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
