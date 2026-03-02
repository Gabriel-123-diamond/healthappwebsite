'use client';

import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ScrollReveal } from '../ui/ScrollReveal';
import { motion } from 'framer-motion';

interface AiSummarySectionProps {
  answer: string;
  isBlurred?: boolean;
}

export const AiSummarySection: React.FC<AiSummarySectionProps> = ({ answer, isBlurred = false }) => {
  return (
    <div className="relative group">
      {/* Premium Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[32px] blur opacity-0 group-hover:opacity-100 transition duration-1000" />
      
      <div className="relative p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-500">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-black text-slate-900 dark:text-white tracking-tight ${isBlurred ? 'blur-[8px] select-none' : ''}`}>AI Clinical Synthesis</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 ${isBlurred ? 'blur-[4px] select-none' : ''}`}>Verified Sources Analyzed</span>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Evidence-Based</span>
          </div>
        </div>

        <div className={`prose prose-slate prose-lg max-w-none dark:prose-invert text-slate-700 dark:text-slate-300 leading-relaxed font-medium ${isBlurred ? 'blur-[12px] select-none pointer-events-none opacity-40' : ''}`}>
          <ReactMarkdown
            components={{
              p: ({children}) => <ScrollReveal className="mb-6 last:mb-0">{children}</ScrollReveal>,
              li: ({children}) => <ScrollReveal className="mb-3 flex items-start gap-3"><div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /><span>{children}</span></ScrollReveal>,
              h1: ({children}) => <ScrollReveal className="mt-10 mb-6"><h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{children}</h1></ScrollReveal>,
              h2: ({children}) => <ScrollReveal className="mt-8 mb-4"><h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{children}</h2></ScrollReveal>,
              h3: ({children}) => <ScrollReveal className="mt-6 mb-3"><h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">{children}</h3></ScrollReveal>,
              strong: ({children}) => <span className="font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter mx-0.5">{children}</span>
            }}
          >
            {answer}
          </ReactMarkdown>
        </div>

        {/* Floating background shape */}
        <div className="absolute bottom-4 right-4 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
          <Sparkles size={120} className="text-blue-600" />
        </div>
      </div>
    </div>
  );
};
