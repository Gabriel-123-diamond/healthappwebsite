'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ArrowRight, ChevronLeft, ChevronRight, 
  Sparkles, AlertTriangle, ShieldCheck, RefreshCcw,
  Send, Bot, User, Loader2
} from 'lucide-react';

interface ChatMessage {
  text: string;
  isAi: boolean;
}

export default function SymptomWizard() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Hello! I'm the IKIKE Health Discovery Engine. How are you feeling today? Please describe any symptoms or discomfort you're experiencing.", isAi: true }
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAnalyzing]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing || result) return;

    const userText = input.trim();
    const newMessages = [...messages, { text: userText, isAi: false }];
    setMessages(newMessages);
    setInput('');
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText,
          history: messages.map(m => ({ role: m.isAi ? 'assistant' : 'user', content: m.text }))
        }),
      });
      
      const data = await response.json();
      
      if (data.isFinal) {
        setResult(data.summary);
        setSuggestion(data.suggestedSpecialty);
      } else {
        setMessages([...newMessages, { text: data.reply, isAi: true }]);
      }
    } catch (err) {
      console.error("Discovery Error:", err);
      setMessages([...newMessages, { text: "I encountered a synchronization error. Could you repeat that?", isAi: true }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setMessages([{ text: "Hello! I'm the IKIKE Health Discovery Engine. How are you feeling today? Please describe any symptoms or discomfort you're experiencing.", isAi: true }]);
    setInput('');
    setResult(null);
    setSuggestion(null);
  };

  const handleConsultSpecialist = () => {
    if (suggestion) {
      window.location.href = `/directory?filter=${encodeURIComponent(suggestion)}`;
    } else {
      window.location.href = '/directory';
    }
  };

  return (
    <div className="bg-white dark:bg-[#0B1221] rounded-[48px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-3xl max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 sm:p-10 text-white relative">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={12} />
              AI Reasoning Engine
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-1">Health Discovery</h2>
            <p className="text-blue-100 text-sm font-medium opacity-80">Adaptive reasoning to guide your wellness path.</p>
          </div>
          <button onClick={reset} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
            <RefreshCcw size={20} />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24" />
      </div>

      <div className="flex flex-col h-[500px]">
        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth bg-slate-50/30 dark:bg-black/10"
        >
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${msg.isAi ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600'}`}>
                  {msg.isAi ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`p-5 rounded-[28px] text-sm leading-relaxed ${
                  msg.isAi 
                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-white/5 shadow-sm' 
                    : 'bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-500/20 font-medium'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}

          {isAnalyzing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map(dot => (
                    <motion.div
                      key={dot}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: dot * 0.2 }}
                      className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reasoning...</span>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 pt-4"
            >
              <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[40px] border border-emerald-100 dark:border-emerald-900/20 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck size={100} className="text-emerald-600" />
                </div>
                <h3 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Activity size={14} /> Intelligence Summary
                </h3>
                <p className="text-slate-700 dark:text-slate-200 font-bold leading-relaxed italic text-lg relative z-10">
                  "{result}"
                </p>
              </div>

              <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/20 flex gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider leading-relaxed">
                  Important: This is not a medical diagnosis. It is an educational discovery tool. Always seek professional advice for health concerns.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleConsultSpecialist}
                  className="flex-1 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Consult {suggestion || "a Specialist"} <ArrowRight size={16} />
                </button>
                <button 
                  onClick={reset}
                  className="flex-1 py-5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-[24px] font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all"
                >
                  Start New Discovery
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-8 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#0B1221]">
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!!result || isAnalyzing}
              placeholder={result ? "Discovery Complete" : "Describe your symptoms in detail..."}
              className="w-full pl-8 pr-16 py-5 bg-slate-50 dark:bg-white/5 rounded-[24px] border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={isAnalyzing || !input.trim() || !!result}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-blue-500/20"
            >
              {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
