'use client';

import React from 'react';
import { Copy, RefreshCw, Link as LinkIcon, Share2, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReferralCodeCardProps {
  code: string;
  generating: boolean;
  onGenerate: () => void;
  onCopy: () => void;
  onCopyLink: () => void;
  onShare: () => void;
}

export default function ReferralCodeCard({ code, generating, onGenerate, onCopy, onCopyLink, onShare }: ReferralCodeCardProps) {
  const isSpecialState = code === 'LOADING...' || code === 'NO CODE' || code === 'LOGIN REQUIRED' || code === 'ERROR' || code === '...';

  // Split code into segments or characters for better display
  const renderCode = () => {
    if (isSpecialState) return code;
    
    return (
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {code.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              inline-flex items-center justify-center 
              w-8 h-12 sm:w-10 sm:h-14 
              rounded-xl sm:rounded-2xl 
              text-xl sm:text-2xl font-black font-mono
              ${char === '-' 
                ? 'bg-transparent text-blue-500 w-4 sm:w-6' 
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg border border-slate-100 dark:border-white/5'
              }
            `}
          >
            {char}
          </motion.span>
        ))}
      </div>
    );
  };

  return (
    <div className="relative max-w-md mx-auto group no-transition">
      {/* Dynamic Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-2xl overflow-hidden transition-colors duration-500">
        {/* Tech Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="p-8 sm:p-10 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] font-black flex items-center gap-2">
                <Zap size={12} className="fill-current" />
                Network Identity Node
              </p>
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1">Unique Referral Key</h4>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
              <Sparkles size={20} />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-black/40 rounded-[32px] p-6 sm:p-10 border border-slate-100 dark:border-white/5 relative group/code overflow-hidden transition-all duration-500">
            {/* Holographic Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover/code:from-blue-500/5 group-hover/code:via-indigo-500/5 group-hover/code:to-purple-500/5 transition-all duration-700" />
            
            <div className="flex flex-col items-center justify-center gap-8 relative z-10">
              <div className="w-full">
                {renderCode()}
              </div>
              
              {!isSpecialState && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCopy}
                  className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-white/10 shadow-md"
                >
                  <Copy size={12} strokeWidth={3} />
                  Copy Protocol Key
                </motion.button>
              )}
            </div>
          </div>

          {!isSpecialState && (
            <div className="grid grid-cols-2 gap-4 mt-8">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCopyLink}
                className="flex items-center justify-center gap-3 py-4 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 transition-all shadow-sm"
              >
                <LinkIcon className="w-4 h-4" strokeWidth={3} />
                Copy Link
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onShare}
                className="flex items-center justify-center gap-3 py-4 px-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
              >
                <Share2 className="w-4 h-4" strokeWidth={3} />
                Broadcast
              </motion.button>
            </div>
          )}
          
          {(code === 'NO CODE' || code === '...') && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGenerate}
              disabled={generating}
              className="mt-8 flex items-center justify-center gap-4 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] transition-all shadow-2xl disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Synchronizing Node...' : 'Initialize Referral Node'}
            </motion.button>
          )}
        </div>

        {/* Footer Technical Detail */}
        <div className="px-10 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
           <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Status: Protocol Active</span>
           <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
              <div className="w-1 h-1 rounded-full bg-blue-500" />
           </div>
        </div>
      </div>
    </div>
  );
}
