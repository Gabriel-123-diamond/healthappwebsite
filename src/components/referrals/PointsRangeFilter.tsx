'use client';

import React from 'react';
import { Coins } from 'lucide-react';

interface PointsRangeFilterProps {
  minPoints: number;
  maxPoints: number;
  onChange: (min: number, max: number) => void;
  maxValue: number;
}

export default function PointsRangeFilter({ minPoints, maxPoints, onChange, maxValue }: PointsRangeFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Coins size={14} className="text-blue-500" />
        <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Points Range</h3>
      </div>
      <div className="px-2 pt-2">
        <input 
          type="range" 
          min="0" 
          max={maxValue} 
          step="10"
          value={maxPoints}
          onChange={(e) => onChange(minPoints, parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all"
        />
        <div className="flex justify-between mt-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">0 PTS</span>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">Up to {maxPoints} PTS</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{maxValue} PTS</span>
        </div>
      </div>
    </div>
  );
}
