'use client';

import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import { MessageSquare, Shield, Sparkles } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3 h-3" />
          AI Powered Healthcare
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
          Chat with <span className="text-blue-600">Ikiké</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Get instant, friendly answers about symptoms, treatments, and herbal wisdom. 
          Your private health conversation, available 24/7.
        </p>
      </div>

      {/* The Chat Component */}
      <ChatInterface />

      {/* Bottom Info */}
      <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Privacy First</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your chats are encrypted and not used to train global models.</p>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Multi-Lingual</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask in any language—I can translate medical terms on the fly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
