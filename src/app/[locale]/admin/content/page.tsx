'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BookOpen, Newspaper, TrendingUp, Plus, Edit2, Trash2, ArrowLeft, Loader2, CheckCircle, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminContentPage() {
  const { isLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'paths' | 'articles' | 'trending'>('paths');
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Simulated fetch for now - in real app, fetch from Firestore
        setPaths([
          { id: '1', title: 'Mastering Digestive Health', category: 'Medical', status: 'published', author: 'Dr. Alpha' },
          { id: '2', title: 'Traditional Herbal Basics', category: 'Herbal', status: 'draft', author: 'Expert Beta' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    if (!isLoading) fetchContent();
  }, [isLoading]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-32 sm:pt-40">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-16 pb-20">
      {/* Header */}
      <div className="bg-slate-900 dark:bg-black text-white p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-xl uppercase tracking-tighter">Content Intelligence</h1>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/admin/learning/create" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2">
                <Plus size={14} /> New Protocol
             </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-10 bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-100 dark:border-white/5 w-fit shadow-sm">
          <button 
            onClick={() => setActiveTab('paths')}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'paths' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
          >
            <BookOpen size={14} /> Learning Paths
          </button>
          <button 
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'articles' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
          >
            <Newspaper size={14} /> Knowledge Base
          </button>
          <button 
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'trending' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
          >
            <TrendingUp size={14} /> Trending Control
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'paths' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paths.map(path => (
                  <div key={path.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm group">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${path.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {path.status}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-slate-300 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                        <button className="text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{path.title}</h3>
                    <p className="text-xs text-slate-400 font-bold mb-6">Node: {path.author}</p>
                    <div className="flex items-center gap-2 pt-6 border-t border-slate-50 dark:border-white/5">
                       <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{path.category} Intelligence</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'articles' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200 dark:border-white/10">
               <Newspaper size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Knowledge Base protocols are under maintenance.</p>
            </motion.div>
          )}

          {activeTab === 'trending' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200 dark:border-white/10">
               <TrendingUp size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Trending Intelligence algorithms are automated.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
