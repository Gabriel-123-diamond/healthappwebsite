import React from 'react';

export function LearningPathSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col h-full animate-pulse relative overflow-hidden">
      {/* Skeleton Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

      {/* Header Area */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Title & Description */}
      <div className="flex-1 space-y-4">
        <div className="space-y-2 mb-4">
          <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>

      {/* Progress & Bottom Info */}
      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
