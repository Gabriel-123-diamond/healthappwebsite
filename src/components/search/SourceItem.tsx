'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, FileText, ShieldCheck, Bookmark, BookmarkCheck } from 'lucide-react';
import { bookmarkService, SavedItem } from '@/services/bookmarkService';

interface SourceItemProps {
  result: any;
  index: number;
  filterFormat?: string;
}

const getGradeColor = (grade?: string) => {
  switch (grade) {
    case 'A': return 'bg-green-100 text-green-700 border-green-200';
    case 'B': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'C': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'D': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

export const SourceItem: React.FC<SourceItemProps> = ({ result, index, filterFormat }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    bookmarkService.isBookmarked(result.id).then(setIsBookmarked);
  }, [result.id]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const savedItem: SavedItem = {
      id: result.id,
      title: result.title,
      excerpt: result.summary,
      type: result.format,
      category: result.type === 'medical' ? 'Medical' : 'Herbal',
      source: result.source,
      date: 'Recently',
      link: result.link,
      evidenceGrade: result.evidenceGrade
    };
    await bookmarkService.toggleBookmark(savedItem);
    setIsBookmarked(!isBookmarked);
  };

  return (
    <motion.a 
      href={result.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-blue-500/5 no-underline flex items-start gap-5"
    >
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-500 ${
        result.format === 'video' 
          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 group-hover:bg-red-600 group-hover:text-white' 
          : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
      }`}>
        {result.format === 'video' ? <PlayCircle size={24} /> : <FileText size={24} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h4 className="font-black text-slate-900 dark:text-white text-base sm:text-lg leading-tight group-hover:text-blue-600 transition-colors truncate sm:whitespace-normal">
            {result.title}
          </h4>
          <button 
            onClick={toggleBookmark}
            className={`p-2 rounded-xl transition-all active:scale-90 ${
              isBookmarked 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 shadow-inner'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 font-medium leading-relaxed">
          {result.summary}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          {result.evidenceGrade && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-[9px] font-black uppercase tracking-[0.1em] ${getGradeColor(result.evidenceGrade)}`}>
              <ShieldCheck size={12} strokeWidth={3} />
              Verified Grade {result.evidenceGrade}
            </div>
          )}
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
            <span className={`w-1.5 h-1.5 rounded-full ${result.type === 'medical' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {result.source}
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
};
