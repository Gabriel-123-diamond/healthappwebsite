'use client';

import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import { MessageSquare, Shield, Sparkles, Lock, Globe, Zap, Cpu } from 'lucide-react';
import { AdminShortcut } from '@/components/common/AdminShortcut';
import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * ChatPage Component
 * 
 * The primary interface for AI-powered clinical conversations.
 * Features a high-performance chat node and privacy-focused metrics.
 */
export default function ChatPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth/signin');
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Verifying Node Authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 sm:pt-32 pb-24 px-4 transition-colors duration-500 relative overflow-hidden">
      
      {/* Background Intelligence Grid Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        
        <ChatHeader />

        {/* The Chat Interface Node */}
        <div className="mb-12">
           <ChatInterface />
        </div>

        {/* Intelligence Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ChatFeatureCard 
            icon={<Shield className="w-5 h-5 text-emerald-500" />}
            title="Privacy First"
            description="Your clinical conversations are encrypted and never used for global training models."
          />
          <ChatFeatureCard 
            icon={<Cpu className="w-5 h-5 text-blue-500" />}
            title="Neural Processing"
            description="Powered by advanced health-specific language models for clinical accuracy."
          />
          <ChatFeatureCard 
            icon={<Globe className="w-5 h-5 text-indigo-500" />}
            title="Polyglot Engine"
            description="Interact in any language. Our system translates complex medical terminology in real-time."
          />
        </div>

        <ChatLegalNotice />
      </div>
    </div>
  );
}

// --- Specialized Sub-components ---

function ChatHeader() {
  return (
    <div className="max-w-4xl mx-auto mb-12 text-center space-y-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100 dark:border-blue-800/50 shadow-sm"
      >
        <Sparkles className="w-3 h-3" />
        AI Neural Network
      </motion.div>
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
        Intelligence <span className="text-blue-600">Terminal.</span>
      </h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
        Consult our advanced medical intelligence for instant insights into symptoms, treatments, and herbal wisdom. 
        Your private clinical advisor, synchronized 24/7.
      </p>
    </div>
  );
}

function ChatFeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-900/5 flex flex-col items-start gap-4 group hover:border-blue-500/30 transition-all duration-500"
    >
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm mb-1">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function ChatLegalNotice() {
  return (
    <div className="mt-12 p-6 bg-slate-100/50 dark:bg-white/[0.02] rounded-[32px] border border-slate-200/50 dark:border-white/5 flex items-center justify-center gap-4 text-center">
      <Lock size={14} className="text-slate-400" />
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
        Medical Grade Security &bull; HIPPA Compliant Encryption &bull; Private Clinical Node
      </p>
    </div>
  );
}
