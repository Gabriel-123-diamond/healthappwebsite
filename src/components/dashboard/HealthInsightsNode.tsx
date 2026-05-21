'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Lock, ChevronRight, AlertCircle, Zap, ShieldCheck, Activity } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { intelligenceService, HealthInsight } from '@/services/intelligenceService';

export default function HealthInsightsNode({ tier }: { tier?: string }) {
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPremium = tier === 'vip1' || tier === 'vip2' || tier === 'premium';

  useEffect(() => {
    if (isPremium) {
      intelligenceService.getPersonalizedInsights()
        .then(setInsights)
        .catch(err => {
          if (err.message === 'UPGRADE_REQUIRED') setError('UPGRADE_REQUIRED');
          else setError('Failed to load intelligence');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isPremium]);

  if (!isPremium) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400">
              <Sparkles size={18} />
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Health Intelligence</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 text-center">
              <Lock size={24} className="mx-auto text-slate-300 mb-3" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                Personalized AI Insights are reserved for PLUS tiers.
              </p>
            </div>
            <Link href="/upgrade" className="flex items-center justify-between p-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all group/btn">
              <span className="text-[10px] font-black uppercase tracking-widest ml-2">Unlock Intelligence</span>
              <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Sparkles size={18} />
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Health Intelligence</h3>
        </div>
        {loading && <Loader2 size={14} className="animate-spin text-blue-600" />}
      </div>

      <div className="space-y-4">
        {insights.length === 0 && !loading ? (
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center py-8">
            Analyzing health data...
          </p>
        ) : (
          insights.map((insight, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 p-1.5 rounded-lg ${
                  insight.priority === 'high' ? 'bg-red-100 text-red-600' : 
                  insight.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <Activity size={12} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
