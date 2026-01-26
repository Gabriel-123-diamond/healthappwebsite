'use client';

import React, { useEffect, useState } from 'react';
import { getQuestions, Question } from '@/services/communityService';
import { Search, PenSquare, Loader2 } from 'lucide-react';
import QuestionCard from '@/components/community/QuestionCard';
import { useLanguage } from '@/context/LanguageContext';

export default function CommunityPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    getQuestions().then(data => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.community.title}</h1>
            <p className="text-slate-600">{t.community.subtitle}</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200">
            <PenSquare className="w-5 h-5" />
            {t.community.askQuestion}
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex items-center gap-4">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder={t.community.searchPlaceholder}
            className="flex-1 outline-none text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Question List */}
        {loading ? (
           <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <QuestionCard key={q.id} question={q} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

