'use client';

import React from 'react';
import { Edit } from 'lucide-react';
import { ExpertContent } from '@/services/expertDashboardService';

interface ExpertContentTableProps {
  content: ExpertContent[];
}

export default function ExpertContentTable({ content }: ExpertContentTableProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Views</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {content.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{item.type}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    item.status === 'Published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                    item.status === 'Draft' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">{item.views.toLocaleString()}</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">{item.date}</td>
                <td className="p-4">
                  <button className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
