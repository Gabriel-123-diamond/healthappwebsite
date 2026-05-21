'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Sparkles } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import { BaseTextArea } from '@/components/common/BaseTextArea';
import { Module } from '@/types/learning';

interface CourseOverviewProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  category: 'Medical' | 'Herbal' | 'Lifestyle';
  setCategory: (value: 'Medical' | 'Herbal' | 'Lifestyle') => void;
  modules: Module[];
}

export function CourseOverview({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  modules
}: CourseOverviewProps) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-white/5 shadow-2xl space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
              <Settings size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Core Configuration</h2>
          </div>

          <BaseInput
            id="title"
            label="Course Master Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a powerful, clinical title"
            className="!rounded-2xl"
          />

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest block">
              Clinical Category
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['Medical', 'Herbal', 'Lifestyle'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                    category === cat 
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                      : 'border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <BaseTextArea
            id="description"
            label="Executive Summary"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Provide a detailed overview of the curriculum and learning outcomes."
            className="!rounded-[32px]"
          />
        </div>
      </div>

      <div className="lg:col-span-5 space-y-8">
        <div className="bg-slate-900 rounded-[40px] p-10 border border-white/5 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles size={120} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight mb-6 relative z-10">Studio Onboarding</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">
            Welcome to the Course Creation Studio. Use the tabs above to define your course structure and content. You can save your progress as a draft at any time.
          </p>
          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 relative z-10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Checklist</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <div className={`w-1.5 h-1.5 rounded-full ${title ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                Set Course Title
              </li>
              <li className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <div className={`w-1.5 h-1.5 rounded-full ${description ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                Write Summary
              </li>
              <li className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <div className={`w-1.5 h-1.5 rounded-full ${modules.length > 0 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                Build Curriculum
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
