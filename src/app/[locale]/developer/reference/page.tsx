'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Book, Code, Globe, Lock, Search, 
  Zap, Shield, MessageSquare, CreditCard, Terminal 
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ApiReferenceItem, ApiEndpoint } from '@/components/developer/ApiReferenceItem';

const CATEGORIES = [
  { id: 'intelligence', label: 'Clinical Intelligence', icon: <Zap size={14} /> },
  { id: 'social', label: 'Social & Network', icon: <MessageSquare size={14} /> },
  { id: 'platform', label: 'Platform & Identity', icon: <Globe size={14} /> },
  { id: 'admin', label: 'Administrative', icon: <Shield size={14} /> },
];

const ENDPOINTS: Record<string, ApiEndpoint[]> = {
  intelligence: [
    {
      method: 'POST',
      path: '/api/search',
      description: 'Executes a clinical intelligence search query across medical and herbal datasets.',
      auth: 'API Key',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'The clinical or herbal query text.' },
        { name: 'mode', type: 'string', required: false, description: 'One of: medical, herbal, both. Defaults to both.' },
      ],
      responseExample: {
        answer: "Clinical summary of the search...",
        results: [{ id: "res_1", title: "Study on Ginger", type: "herbal" }],
        disclaimer: "Medical disclaimer text..."
      }
    },
    {
      method: 'GET',
      path: '/api/intelligence/trends',
      description: 'Fetches real-time clinical search trends and rising health concerns by region.',
      auth: 'API Key',
      responseExample: {
        trends: [
          { topic: "Flu Prevention", volume: 1200, growth: "+15%" }
        ]
      }
    }
  ],
  social: [
    {
      method: 'POST',
      path: '/api/chat',
      description: 'Initializes or retrieves a clinical consultation chat room.',
      auth: 'User Token',
      parameters: [
        { name: 'participantId', type: 'string', required: true, description: 'UID of the expert or patient.' }
      ],
      responseExample: {
        chatId: "chat_abc123",
        participants: ["uid_1", "uid_2"],
        status: "active"
      }
    },
    {
      method: 'POST',
      path: '/api/referral/generate',
      description: 'Generates a unique referral code for the authenticated user.',
      auth: 'User Token',
      responseExample: {
        code: "IKK-9921",
        points: 150
      }
    }
  ],
  platform: [
    {
      method: 'POST',
      path: '/api/user/upgrade',
      description: 'Upgrades a users access tier (requires active payment session).',
      auth: 'User Token',
      parameters: [
        { name: 'tier', type: 'string', required: true, description: 'plus, elite, vip1, or vip2.' }
      ],
      responseExample: {
        success: true,
        newTier: "elite",
        expiresAt: "2026-03-17T00:00:00Z"
      }
    }
  ],
  admin: [
    {
      method: 'POST',
      path: '/api/admin/expert/verify',
      description: 'Approves or rejects an expert application. Restricted to Super Admins.',
      auth: 'Admin Session',
      parameters: [
        { name: 'expertId', type: 'string', required: true, description: 'UID of the expert application.' },
        { name: 'status', type: 'string', required: true, description: 'verified or rejected.' }
      ],
      responseExample: {
        message: "Expert application verified successfully."
      }
    }
  ]
};

export default function ApiReferencePage() {
  const [activeCategory, setActiveCategory] = useState('intelligence');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <Link 
          href="/developer" 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Developer Portal
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:flex gap-12">
        {/* Navigation Sidebar */}
        <aside className="lg:w-64 space-y-2 mb-12 lg:mb-0">
          <div className="px-4 mb-6">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">API Reference</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Version 1.0.0 (Latest)</p>
          </div>
          
          <nav className="space-y-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${activeCategory === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </nav>

          <div className="pt-8 px-4">
            <div className="p-6 bg-slate-900 dark:bg-black rounded-3xl border border-white/5 shadow-xl">
              <Terminal size={20} className="text-blue-400 mb-4" />
              <h3 className="text-white font-bold text-xs mb-2 uppercase tracking-widest">Base URL</h3>
              <code className="text-[10px] text-blue-300 font-mono break-all">https://api.ikikehealth.com/api/v1</code>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 space-y-12">
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Explore the endpoints available within the {CATEGORIES.find(c => c.id === activeCategory)?.label} stack. All requests are logged for clinical auditing.
            </p>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {ENDPOINTS[activeCategory].map((endpoint, i) => (
                  <ApiReferenceItem key={i} endpoint={endpoint} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Support Section */}
          <section className="bg-blue-600 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Need help integrating?</h3>
              <p className="text-blue-100 mb-8 max-w-xl">Our clinical engineering team is available to assist with complex hospital integrations and research data pipelines.</p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all active:scale-95 shadow-xl">
                Contact API Support
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
