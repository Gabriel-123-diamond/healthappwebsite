'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getSearchHistory, clearSearchHistory } from '@/services/historyService';
import { SearchHistoryItem } from '@/types/history';
import { History, Calendar, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const fetchHistory = React.useCallback(async (userId: string) => {
    setLoading(true);
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    if (end) end.setHours(23, 59, 59, 999);

    const data = await getSearchHistory(userId, start, end);
    setHistory(data);
    setLoading(false);
  }, [startDate, endDate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchHistory(user.uid);
      } else {
        router.push('/auth/signin');
      }
    });
    return () => unsubscribe();
  }, [fetchHistory, router]);

  const handleClearHistory = async () => {
    if (!window.confirm(t.history.clearConfirm || "Are you sure you want to permanently clear your entire search history?")) return;
    
    setClearing(true);
    try {
      await clearSearchHistory();
      setHistory([]);
    } catch (e) {
      alert("Failed to clear history");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
              <History className="text-blue-600" /> {t.history.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{t.history.subtitle}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleClearHistory}
              disabled={clearing || history.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-30 shadow-sm"
            >
              {clearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Clear All
            </button>

            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Calendar size={16} className="text-slate-400 ml-2" />
              <input 
                type="date" 
                className="text-xs bg-transparent outline-none text-slate-900 dark:text-white font-bold"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-slate-300">-</span>
              <input 
                type="date" 
                className="text-xs bg-transparent outline-none text-slate-900 dark:text-white font-bold"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <History size={40} className="text-slate-200 dark:text-slate-700" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.history.noHistory}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">{t.history.noHistoryDesc}</p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {history.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors capitalize">{item.query}</h3>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                    item.mode === 'medical' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                    item.mode === 'herbal' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 
                    'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
                  }`}>
                    {item.mode}
                  </span>
                </div>
                {item.summary && (
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed font-medium">{item.summary}</p>
                )}
                <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800/50 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {item.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  <button 
                    onClick={() => router.push(`/search?q=${encodeURIComponent(item.query)}&mode=${item.mode}`)}
                    className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Repeat Search
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}