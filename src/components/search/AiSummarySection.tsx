'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ScrollReveal } from '../ui/ScrollReveal';

interface AiSummarySectionProps {
  answer: string;
}

export const AiSummarySection: React.FC<AiSummarySectionProps> = ({ answer }) => {
  return (
    <div className="p-5 sm:p-8 border-b border-slate-100 dark:border-slate-700">
      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        AI Summary
      </h3>
      <div className="prose prose-slate prose-sm sm:prose-base max-w-none dark:prose-invert text-slate-700 dark:text-slate-300 leading-relaxed">
        <ReactMarkdown
          components={{
            p: ({children}) => <ScrollReveal className="mb-4">{children}</ScrollReveal>,
            li: ({children}) => <ScrollReveal className="mb-2"><li className="list-disc ml-4">{children}</li></ScrollReveal>,
            h1: ({children}) => <ScrollReveal className="mt-6 mb-4"><h1 className="text-xl sm:text-2xl font-black">{children}</h1></ScrollReveal>,
            h2: ({children}) => <ScrollReveal className="mt-6 mb-4"><h2 className="text-lg sm:text-xl font-black">{children}</h2></ScrollReveal>,
            h3: ({children}) => <ScrollReveal className="mt-4 mb-2"><h3 className="text-base sm:text-lg font-black">{children}</h3></ScrollReveal>,
          }}
        >
          {answer}
        </ReactMarkdown>
      </div>
    </div>
  );
};
