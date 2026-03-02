'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export function Skeleton({ className = "", width, height, borderRadius }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={`bg-slate-200 dark:bg-slate-800 ${className}`}
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius ?? '1rem'
      }}
    />
  );
}

export function FeedCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton width={48} height={48} borderRadius="1rem" />
        <div className="space-y-2">
          <Skeleton width={120} height={12} />
          <Skeleton width={80} height={8} />
        </div>
      </div>
      <Skeleton width="100%" height={200} borderRadius="1.5rem" />
      <div className="space-y-3">
        <Skeleton width="100%" height={14} />
        <Skeleton width="90%" height={14} />
        <Skeleton width="40%" height={14} />
      </div>
    </div>
  );
}

export function ExpertCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-6 mb-6">
        <Skeleton width={64} height={64} borderRadius="1.25rem" />
        <div className="space-y-2 flex-1">
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <Skeleton width={80} height={24} borderRadius="0.5rem" />
        <Skeleton width={80} height={24} borderRadius="0.5rem" />
      </div>
      <Skeleton width="100%" height={48} borderRadius="1rem" />
    </div>
  );
}
