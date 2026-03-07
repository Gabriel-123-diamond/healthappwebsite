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
    if (isSpecialState) return <span className="text-xl font-black opacity-50 tracking-widest">{code}</span>;
    
    return (
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {code.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className={`
              inline-flex items-center justify-center 
              w-7 h-10 sm:w-8 sm:h-12 
              rounded-lg sm:rounded-xl 
              text-sm sm:text-lg font-black font-mono
              ${char === '-' 
                ? 'bg-transparent text-blue-500 w-2 sm:w-4' 
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md border border-slate-100 dark:border-white/5'
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
    <div className="relative max-w-sm mx-auto group no-transition">
      {/* Dynamic Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/10 shadow-xl overflow-hidden transition-colors duration-500">
        {/* Tech Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]" />
        
        <div className="p-6 sm:p-8 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[9px] text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] font-black flex items-center gap-1.5">
                <Zap size={10} className="fill-current" />
                Network Identity
              </p>
              <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mt-0.5">Referral Key</h4>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Sparkles size={16} />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-black/40 rounded-[24px] p-5 sm:p-8 border border-slate-100 dark:border-white/5 relative group/code overflow-hidden transition-all duration-500">
            {/* Holographic Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover/code:from-blue-500/5 group-hover/code:via-indigo-500/5 group-hover/code:to-purple-500/5 transition-all duration-700" />
            
            <div className="flex flex-col items-center justify-center gap-6 relative z-10">
              <div className="w-full">
                {renderCode()}
              </div>
              
              {!isSpecialState && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCopy}
                  className="flex items-center gap-2 px-5 py-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-white/10 shadow-sm"
                >
                  <Copy size={10} strokeWidth={3} />
                  Copy Key
                </motion.button>
              )}
            </div>
          </div>

          {!isSpecialState && (
            <div className="grid grid-cols-2 gap-3 mt-6">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCopyLink}
                className="flex items-center justify-center gap-2 py-3 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 transition-all"
              >
                <LinkIcon className="w-3.5 h-3.5" strokeWidth={3} />
                Link
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onShare}
                className="flex items-center justify-center gap-2 py-3 px-3 bg-blue-600 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                <Share2 className="w-3.5 h-3.5" strokeWidth={3} />
                Share
              </motion.button>
            </div>
          )}
          
          {(code === 'NO CODE' || code === '...') && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGenerate}
              disabled={generating}
              className="mt-6 flex items-center justify-center gap-3 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Syncing...' : 'Get Referral Key'}
            </motion.button>
          )}
        </div>

        {/* Footer Technical Detail */}
        <div className="px-8 py-3 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
           <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocol Active</span>
           <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
           </div>
        </div>
      </div>
    </div>
  );
}
