'use client';

import React, { useState } from 'react';
import { Copy, RefreshCw, Link as LinkIcon, Share2, Check, Trash2, Plus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferralCodeCardProps {
  codes: any[];
  loading: boolean;
  generating: boolean;
  onGenerate: (usageLimit?: number) => void;
  onDelete: (code: string) => void;
  onCopy: (code: string) => void;
  onCopyLink: (code: string) => void;
  onShare: (code: string) => void;
}

export default function ReferralCodeCard({ 
  codes, 
  loading, 
  generating, 
  onGenerate, 
  onDelete, 
  onCopy, 
  onCopyLink, 
  onShare 
}: ReferralCodeCardProps) {
  const [usageLimit, setUsageLimit] = useState<number>(0);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  const handleCopy = (code: string, type: 'key' | 'link') => {
    const key = `${code}-${type}`;
    if (type === 'key') onCopy(code);
    else onCopyLink(code);
    
    setCopyStatus(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopyStatus(prev => ({ ...prev, [key]: false })), 2000);
  };

  return (
    <div className="w-full space-y-8">
      {/* Create New Key Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-xl p-8 sm:p-10 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="text-left">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Create New Key</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Generate a custom referral protocol</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Usage Limit</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(parseInt(e.target.value) || 0)}
                  className="w-24 px-4 py-2.5 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="0 (Unlimited)"
                />
                <div className="absolute -right-2 -top-2">
                  <div className="group relative">
                    <Info size={12} className="text-slate-300 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-slate-800 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Set to 0 for unlimited uses of this code.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onGenerate(usageLimit)}
              disabled={generating}
              className="mt-5 flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus size={16} strokeWidth={3} />}
              {generating ? 'Issuing...' : 'Generate Key'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Active Keys List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Your Active Keys</h3>
          <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {codes.length} {codes.length === 1 ? 'Key' : 'Keys'}
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500/20" />
          </div>
        ) : codes.length > 0 ? (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {codes.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-lg p-6 sm:p-8 hover:border-blue-500/20 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Key Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <div 
                          onClick={() => handleCopy(item.code, 'key')}
                          className="px-6 py-3 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-white/5 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center gap-3"
                        >
                          <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white tracking-widest">
                            {item.code}
                          </span>
                          <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg text-slate-400">
                            {copyStatus[`${item.code}-key`] ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </div>
                        </div>
                        
                        <div className="hidden sm:block">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Active</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Usage</p>
                          <div className="flex items-end gap-1.5">
                            <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
                              {item.usageCount || 0}
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none pb-0.5">
                              / {item.usageLimit === 0 ? '∞' : item.usageLimit} uses
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 max-w-[120px]">
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: item.usageLimit === 0 ? '100%' : `${(item.usageCount / item.usageLimit) * 100}%` }}
                              className={`h-full ${item.usageLimit === 0 ? 'bg-blue-500/20' : 'bg-blue-500'}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Actions */}
                    <div className="flex items-center gap-3 self-end md:self-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopy(item.code, 'link')}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all"
                      >
                        {copyStatus[`${item.code}-link`] ? <Check size={14} className="text-emerald-500" /> : <LinkIcon size={14} />}
                        Link
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onShare(item.code)}
                        className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                      >
                        <Share2 size={18} />
                      </motion.button>

                      <div className="w-px h-8 bg-slate-100 dark:bg-white/5 mx-1" />

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(item.code)}
                        className="flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200 dark:border-white/5">
            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Plus size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold">No active referral protocols found.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Generate your first key to start growing your network.</p>
          </div>
        )}
      </div>
    </div>
  );
}
