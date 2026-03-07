'use client';

import React from 'react';
import { Bot, CheckCircle, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PendingReview } from '@/services/reviewService';

interface ReviewQueueProps {
  pending: PendingReview[];
  loading: boolean;
}

export const ReviewQueue: React.FC<ReviewQueueProps> = ({ pending, loading }) => {
  if (loading) {
    return (
      <div className="p-20 flex justify-center">
        <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bot className="text-blue-600 dark:text-blue-400 w-5 h-5" />
          Pending Reviews
        </h2>
        <span className="bg-blue-100 text-blue-700 text-xs font-black px-2.5 py-1 rounded-full">
          {pending.length} PENDING
        </span>
      </div>
      {pending.length === 0 ? (
        <div className="p-20 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-20" />
          <p className="text-slate-400 font-medium">All caught up! No responses need review.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {pending.map((item) => (
            <Link 
              key={item.queryId} 
              href={`/expert/review/${item.queryId}`}
              className="block p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:text-blue-400 transition-colors">
                  {item.query}
                </h3>
                <span className="text-[10px] font-black text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.timestamp.toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {item.answer}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded uppercase">
                    {item.mode}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Review Now <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};
