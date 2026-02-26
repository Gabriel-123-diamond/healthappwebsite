'use client';

import React from 'react';
import { FileText, Lock, Download, ChevronRight, BookOpen } from 'lucide-react';
import { Institution } from '@/types/institution';

interface LibrarySectionProps {
  libraries: Institution['library'];
}

export default function LibrarySection({ libraries }: LibrarySectionProps) {
  if (!libraries || libraries.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-slate-500" />
        Knowledge Libraries
      </h2>
      <div className="grid gap-6">
        {libraries.map((lib) => (
          <div key={lib.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-slate-900">{lib.title}</h3>
              {lib.isPremium && (
                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Premium
                </span>
              )}
            </div>
            <p className="text-slate-600 text-sm mb-4">{lib.description}</p>
            
            {lib.resources.length > 0 ? (
              <div className="space-y-2">
                {lib.resources.map((res) => (
                  <div key={res.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{res.title}</span>
                    </div>
                    <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">
                      {res.type}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-slate-50 rounded-xl text-slate-400 text-sm italic">
                {lib.isPremium ? "Access required to view resources" : "No resources available yet"}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
