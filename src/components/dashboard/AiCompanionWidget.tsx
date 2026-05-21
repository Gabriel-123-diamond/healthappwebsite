'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, ArrowRight, Bot } from 'lucide-react';
import Link from 'next/link';

export function AiCompanionWidget() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Bot size={24} className="text-white" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest">Companion Online</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-black uppercase tracking-tight leading-none">AI Health Companion</h3>
          <p className="text-blue-100 text-xs font-medium leading-relaxed opacity-80">
            Ask anything about your health, symptoms, or medications. I'm here to guide your journey.
          </p>
        </div>

        <Link 
          href="/chat"
          className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-xl"
        >
          Start Conversation <MessageCircle size={14} />
        </Link>
      </div>

      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute top-0 right-0 p-8 opacity-10">
         <Sparkles size={96} className="rotate-12" />
      </div>
    </div>
  );
}
