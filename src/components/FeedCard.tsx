'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, CheckCircle, ExternalLink, ShieldCheck, Bookmark, BookmarkCheck } from 'lucide-react';
import { FeedItem } from '@/services/feedService';
import { bookmarkService, SavedItem } from '@/services/bookmarkService';

interface FeedCardProps {
  item: FeedItem;
  index: number;
  t: any;
}

export const FeedCard: React.FC<FeedCardProps> = ({ item, index, t }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    bookmarkService.isBookmarked(item.id).then(setIsBookmarked);
  }, [item.id]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const savedItem: SavedItem = {
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      type: item.type,
      category: item.category,
      source: item.source,
      date: item.date,
      link: item.link,
      evidenceGrade: item.evidenceGrade,
      imageUrl: item.imageUrl
    };
    await bookmarkService.toggleBookmark(savedItem);
    setIsBookmarked(!isBookmarked);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Medical': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Herbal': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    }
  };

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'B': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'C': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      default: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const displayCategory = item.category === 'Medical' ? t.common.medical : item.category === 'Herbal' ? t.common.herbal : item.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      <div className="h-32 bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
        <div className={`absolute inset-0 opacity-10 ${
          item.category === 'Medical' ? 'bg-blue-500' : 
          item.category === 'Herbal' ? 'bg-emerald-500' : 'bg-purple-500'
        }`} />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(item.category)}`}>
            {displayCategory}
          </span>
          {item.evidenceGrade && (
            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${getGradeColor(item.evidenceGrade)}`}>
              <ShieldCheck className="w-3 h-3" />
              Grade {item.evidenceGrade}
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={toggleBookmark}
            className={`w-8 h-8 rounded-full ${isBookmarked ? 'bg-blue-600 text-white' : 'bg-white/90 text-slate-700'} backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all`}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
          <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
            {item.type === 'video' ? <PlayCircle className="w-4 h-4 text-slate-700" /> : <FileText className="w-4 h-4 text-slate-700" />}
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{item.source}</span>
          <span>•</span>
          <span>{item.date}</span>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3 flex-1">
          {item.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
          {item.isVerified ? (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t.feed.verified}</span>
            </div>
          ) : (
             <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <span>{t.feed.community}</span>
            </div>
          )}
          
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
