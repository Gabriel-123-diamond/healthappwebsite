'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function ChatInterface() {
  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden items-center justify-center">
      <div className="text-center p-8">
        <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Chat System Updating</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          We are currently upgrading our AI systems to serve you better. Please check back later.
        </p>
      </div>
    </div>
  );
}