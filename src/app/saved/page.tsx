'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, Calendar, Stethoscope, Leaf, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// Mock data to match Mobile App
const INITIAL_SAVED_ITEMS = [
  {
    id: '1',
    title: 'Migraine Remedies',
    type: 'Both',
    date: 'Oct 24, 2025',
    summary: 'Peppermint oil and hydration are key natural remedies alongside standard analgesics like Ibuprofen.'
  },
  {
    id: '2',
    title: 'High Blood Pressure',
    type: 'Medical',
    date: 'Oct 22, 2025',
    summary: 'Common ACE inhibitors include Lisinopril. Lifestyle changes such as reducing sodium intake are crucial.'
  },
  {
    id: '3',
    title: 'Ginger Benefits',
    type: 'Herbal',
    date: 'Oct 20, 2025',
    summary: 'Ginger is effective for nausea and digestion. It has anti-inflammatory properties verified by studies.'
  },
];

export default function SavedPage() {
  const [savedItems, setSavedItems] = useState(INITIAL_SAVED_ITEMS);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth/signin');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleDelete = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = savedItems.filter(item => {
    const itemDate = new Date(item.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    if (start && itemDate < start) return false;
    if (end && itemDate > end) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Bookmark className="w-6 h-6 text-blue-600" />
              </div>
              {t.saved.title}
            </h1>
            <p className="text-slate-600">{t.saved.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <Calendar size={16} className="text-slate-400 ml-2" />
            <input 
              type="date" 
              className="text-sm bg-transparent outline-none text-slate-900"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-slate-300">-</span>
            <input 
              type="date" 
              className="text-sm bg-transparent outline-none text-slate-900"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </header>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t.saved.noSaved}</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              {t.saved.noSavedDesc}
            </p>
          </div>
        ) : (
          <motion.div layout className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <SavedItemCard key={item.id} item={item} onDelete={handleDelete} t={t} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SavedItemCard({ item, onDelete, t }: { item: any, onDelete: (id: string) => void, t: any }) {
  const getIcon = () => {
    switch (item.type) {
      case 'Medical': return <Stethoscope className="w-5 h-5 text-blue-600" />;
      case 'Herbal': return <Leaf className="w-5 h-5 text-emerald-600" />;
      default: return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
  };

  const getColorClass = () => {
    switch (item.type) {
      case 'Medical': return 'bg-blue-50 border-blue-100 text-blue-700';
      case 'Herbal': return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      default: return 'bg-purple-50 border-purple-100 text-purple-700';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getColorClass()}`}>
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${getColorClass()}`}>
                {item.type}
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-3 pr-8">
              {item.summary}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Calendar className="w-3 h-3" />
              {t.saved.savedOn} {item.date}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(item.id)}
          className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title={t.saved.remove}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}