'use client';

import React from 'react';
import { Trophy } from 'lucide-react';

interface PointsBadgeProps {
  points: number;
  label?: string;
  className?: string;
}

export default function PointsBadge({ points, label = "Health Points", className = "" }: PointsBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-200/50 ${className}`}>
      <Trophy className="w-6 h-6 text-yellow-300" />
      <div className="text-left">
        <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-xl font-black text-white leading-none">{points} PTS</p>
      </div>
    </div>
  );
}
