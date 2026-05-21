'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User, Loader2, PlusCircle } from 'lucide-react';

export function RoadmapAiPlanner() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', content: "Hello! I am your Wellness Architect. How can I help optimize your roadmap today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(res => setTimeout(res, 1500));
    
    let aiResponse = "I've analyzed your request. I recommend adding a new 'Hydration Sprint' milestone to your roadmap for the next 7 days.";
    let milestone = null;

    if (query.toLowerCase().includes('sleep')) {
      aiResponse = "Deep sleep optimization detected. I'm adding a 'Digital Sunset' milestone to your roadmap at 9:00 PM.";
      milestone = { title: "Digital Sunset", type: "Sleep" };
    } else if (query.toLowerCase().includes('water') || query.toLowerCase().includes('hydrate')) {
      aiResponse = "Hydration level critical. I've updated your daily target to 3L and added a 'Morning Flush' node.";
      milestone = { title: "Morning Flush", type: "Hydration" };
    }

    setMessages(prev => [...prev, { role: 'ai', content: aiResponse, milestone }]);
    setIsTyping(false);
  };

  return (
    <div className="bg-[#0B1221] rounded-[48px] border border-white/5 shadow-2xl overflow-hidden flex flex-col h-[500px]">
      <div className="p-8 border-b border-white/5 bg-white/5 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Roadmap AI Architect</h3>
          <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            Neural Engine Active
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((msg, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-400'}`}>
              {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className="space-y-4 max-w-[80%]">
              <div className={`p-5 rounded-[24px] text-sm font-medium leading-relaxed ${msg.role === 'ai' ? 'bg-white/5 text-slate-200 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                {msg.content}
              </div>
              {msg.milestone && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <PlusCircle size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-tight">Add Milestone: {msg.milestone.title}</span>
                  </div>
                  <button className="text-[8px] font-black text-emerald-500 uppercase tracking-widest hover:underline">Apply to Roadmap</button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="p-5 rounded-[24px] bg-white/5 rounded-tl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150" />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white/5 border-t border-white/5">
        <div className="relative">
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Optimize my roadmap for better sleep..."
            className="w-full pl-6 pr-14 py-4 bg-[#020617] border border-white/10 rounded-2xl text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-all"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
