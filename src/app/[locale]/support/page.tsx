'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search, HelpCircle, MessageCircle, Mail, Phone, ChevronRight } from 'lucide-react';

export default function SupportPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{t.support.title}</h1>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder={t.support.searchPlaceholder}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center hover:border-blue-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{t.support.liveChat}</h3>
            <p className="text-sm text-slate-500">Chat with our support team.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center hover:border-blue-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{t.support.emailUs}</h3>
            <p className="text-sm text-slate-500">Get a response within 24h.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center hover:border-blue-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{t.support.callUs}</h3>
            <p className="text-sm text-slate-500">Available Mon-Fri, 9am-5pm.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              {t.support.faq}
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              "How do I verify my expert profile?",
              "Is my health data private?",
              "How does the AI search work?",
              "Can I export my journal data?"
            ].map((q, i) => (
              <button key={i} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left group">
                <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{q}</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}