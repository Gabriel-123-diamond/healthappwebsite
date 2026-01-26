'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getSearchHistory, SearchHistoryItem } from '@/services/historyService';
import { History, Calendar, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchHistory(user.uid);
      } else {
        router.push('/auth/signin');
      }
    });
    return () => unsubscribe();
  }, [startDate, endDate]);

  const fetchHistory = async (userId: string) => {
    setLoading(true);
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    if (end) end.setHours(23, 59, 59, 999);

    const data = await getSearchHistory(userId, start, end);
    setHistory(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <History className="text-blue-600" /> {t.history.title}
            </h1>
            <p className="text-slate-500 mt-1">{t.history.subtitle}</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <Calendar size={16} className="text-slate-400 ml-2" />
            <input 
              type="date" 
              className="text-sm bg-transparent outline-none text-slate-900"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder={t.history.startDate}
            />
            <span className="text-slate-300">-</span>
            <input 
              type="date" 
              className="text-sm bg-transparent outline-none text-slate-900"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder={t.history.endDate}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <History size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">{t.history.noHistory}</h3>
            <p className="text-slate-500">{t.history.noHistoryDesc}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900">{item.query}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg uppercase ${
                    item.mode === 'medical' ? 'bg-blue-50 text-blue-600' :
                    item.mode === 'herbal' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {item.mode}
                  </span>
                </div>
                {item.summary && (
                  <p className="text-slate-600 text-sm line-clamp-2">{item.summary}</p>
                )}
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                  <span>
                    {item.timestamp.toLocaleDateString()} • {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}