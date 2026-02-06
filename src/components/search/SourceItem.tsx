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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.01, x: 5 }}
      className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors flex items-start gap-4 group cursor-pointer shadow-sm hover:shadow-md no-underline min-w-0"
    >
      <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${result.format === 'video' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
        {result.format === 'video' ? <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : <FileText className="w-5 h-5 sm:w-6 sm:h-6" />}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate sm:whitespace-normal">{result.title}</h4>
          <button 
            onClick={toggleBookmark}
            className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-blue-600 bg-blue-50' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-100'}`}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">{result.summary}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
            result.format === 'video' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {result.format === 'video' ? 'Video' : 'Article'}
          </span>
          <span className={`text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
            result.type === 'medical' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {result.type === 'medical' ? 'Medical' : 'Herbal'}
          </span>
          {result.evidenceGrade && (
            <span className={`text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border flex items-center gap-1 ${getGradeColor(result.evidenceGrade)}`}>
              <ShieldCheck className="w-2 h-2 sm:w-3 sm:h-3" />
              Grade {result.evidenceGrade}
            </span>
          )}
          <span className="text-[10px] text-slate-400 truncate">• {result.source}</span>
        </div>
      </div>
      <ArrowRight className="hidden sm:block w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors self-center shrink-0" />
    </motion.a>
  );
};
