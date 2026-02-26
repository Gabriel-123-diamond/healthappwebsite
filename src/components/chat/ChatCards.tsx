import React from 'react';
import { MapPin, ExternalLink, Stethoscope, BookOpen } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

export const ExpertsList = ({ experts }: { experts: any[] }) => {
  if (!experts || experts.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <Stethoscope className="w-4 h-4" /> Found Experts
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {experts.map((expert: any, idx: number) => (
          <div key={idx} className="min-w-[240px] p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
            <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{expert.name}</h4>
            <p className="text-blue-600 dark:text-blue-400 text-sm mb-1 line-clamp-1">{expert.specialty}</p>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-1">
              <MapPin className="w-3 h-3" /> {expert.location}
            </div>
            <Link 
              href={`/directory/${expert.id}`}
              className="block w-full text-center py-2 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-600"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const SourcesList = ({ sources }: { sources: any[] }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
       <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <BookOpen className="w-4 h-4" /> Research Sources
      </div>
      <div className="grid gap-2">
        {sources.map((source: any, idx: number) => (
          <a 
            key={idx} 
            href={source.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors group"
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">{source.title}</span>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
          </a>
        ))}
      </div>
    </motion.div>
  );
};
