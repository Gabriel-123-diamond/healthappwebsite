'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface ExpertResultCardProps {
  expert: any;
}

export const ExpertResultCard: React.FC<ExpertResultCardProps> = ({ expert }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg flex-shrink-0">
          {expert.name[0]}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white truncate">{expert.name}</h3>
          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1 truncate">{expert.specialty}</p>
          <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{expert.location}</span>
          </p>
        </div>
      </div>
      <Link 
        href={`/directory/${expert.id}`}
        className="mt-4 block w-full py-2 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-center rounded-lg text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
      >
        View Profile
      </Link>
    </div>
  );
};
