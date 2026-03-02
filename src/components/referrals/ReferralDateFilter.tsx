'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, CheckCircle2, ListFilter, Calendar, RotateCcw, ChevronDown } from 'lucide-react';
import DateRangePicker from '../common/DateRangePicker';
import PointsRangeFilter from './PointsRangeFilter';
import { REWARD_POINTS } from '@/services/referralService';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferralDateFilterProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  statusFilter: 'all' | 'pending' | 'completed';
  setStatusFilter: (status: 'all' | 'pending' | 'completed') => void;
  pointsFilter: number;
  setPointsFilter: (points: number) => void;
  filteredPoints: number;
}

export default function ReferralDateFilter({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  statusFilter,
  setStatusFilter,
  pointsFilter,
  setPointsFilter,
  filteredPoints,
}: ReferralDateFilterProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  
  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
    setPointsFilter(REWARD_POINTS);
  };

  const setPresetRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions = [
    { id: 'all', label: 'All Referrals', icon: ListFilter },
    { id: 'pending', label: 'Pending Only', icon: Clock },
    { id: 'completed', label: 'Completed Only', icon: CheckCircle2 },
  ];

  const currentStatus = statusOptions.find(o => o.id === statusFilter) || statusOptions[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[48px] p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8 sm:space-y-10 relative overflow-hidden transition-colors">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 dark:bg-blue-900/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none hidden sm:block" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Advanced Filters</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Fine-tune your referral tracking and rewards summary.</p>
        </div>

        <button 
          onClick={resetFilters}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 w-full sm:w-auto"
        >
          <RotateCcw size={14} />
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 items-end relative z-10">
        
        {/* 1. Status Custom Dropdown */}
        <div className="space-y-4" ref={statusRef}>
          <div className="flex items-center gap-2 mb-1">
            <ListFilter size={14} className="text-blue-500" />
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">Referral Status</h3>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all font-bold text-slate-900 dark:text-white text-sm shadow-sm"
            >
              <div className="flex items-center gap-3">
                <currentStatus.icon size={16} className="text-blue-500" />
                <span>{currentStatus.label}</span>
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isStatusOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isStatusOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 p-1.5"
                >
                  {statusOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setStatusFilter(option.id as any);
                        setIsStatusOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        statusFilter === option.id 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600'
                      }`}
                    >
                      <option.icon size={16} className={statusFilter === option.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 2. Custom Date Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-blue-500" />
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">Date Interval</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPresetRange(7)} className="text-[9px] font-black text-blue-500 dark:text-blue-400 hover:underline uppercase transition-colors">7D</button>
              <button onClick={() => setPresetRange(30)} className="text-[9px] font-black text-blue-500 dark:text-blue-400 hover:underline uppercase transition-colors">30D</button>
            </div>
          </div>
          <DateRangePicker 
            startDate={startDate}
            endDate={endDate}
            onRangeChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
        </div>

        {/* 3. Points Entry Range */}
        <PointsRangeFilter 
          minPoints={0}
          maxPoints={pointsFilter}
          onChange={(min, max) => setPointsFilter(max)}
          maxValue={REWARD_POINTS * 10} // Scaling for future multiple rewards
        />
      </div>

      {/* Result Summary */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 bg-slate-900 dark:bg-black rounded-3xl sm:rounded-[32px] text-white gap-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
            <CheckCircle2 size={24} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Selection Result</p>
            <p className="text-lg font-black tracking-tight text-white">Displaying Filtered Data</p>
          </div>
        </div>
        
        <div className="text-center sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-800 dark:border-slate-900">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Rewards in selection</p>
          <p className="text-3xl font-black text-white leading-none">{filteredPoints} <span className="text-sm text-blue-400">PTS</span></p>
        </div>
      </div>
    </div>
  );
}
