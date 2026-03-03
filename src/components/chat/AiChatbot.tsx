'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isAi: boolean;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm your IKIKE AI Assistant. How can I help you today?", isAi: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { id: Date.now().toString(), text: input, isAi: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Use the discovery API logic or a dedicated chat API
      const response = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers: { primary: input, severity: 'query', duration: 'context' } 
        }),
      });
      const data = await response.json();
      
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        text: data.summary || "I'm processing that information. Please consult our directory for specific specialist advice.", 
        isAi: true 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = { id: 'err', text: "Connection error. Please try again later.", isAi: true };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center z-[60] transition-all active:scale-90 group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
              <MessageSquare size={24} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-[380px] h-[550px] bg-white dark:bg-[#0B1221] rounded-[40px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-white/10 z-[60] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 p-6 text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-black tracking-tight leading-none mb-1">Health Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-70">AI Active</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${msg.isAi ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                      {msg.isAi ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                      msg.isAi 
                        ? 'bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-tl-sm' 
                        : 'bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-500/20'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl rounded-tl-sm">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about your health..."
                  className="w-full pl-6 pr-14 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 outline-none text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-center mt-4 text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
                <Sparkles size={10} /> AI Generated Response
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
