'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, CheckCircle, ExternalLink, ShieldCheck, Bookmark, BookmarkCheck, Clock, Share2 } from 'lucide-react';
import { FeedItem } from '@/services/feedService';
import { bookmarkService, SavedItem } from '@/services/bookmarkService';
import { RestrictedAccessModal } from './RestrictedAccessModal';
import { auth } from '@/lib/firebase';

interface FeedCardProps {
  item: FeedItem;
  index: number;
  t: any;
  isBlurred?: boolean;
}

export const FeedCard: React.FC<FeedCardProps> = ({ item, index, t, isBlurred = false }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      bookmarkService.isBookmarked(item.id).then(setIsBookmarked);
    } else {
      setIsBookmarked(false);
    }
  }, [item.id]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!auth.currentUser) {
      setShowModal(true);
      return;
    }

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

  const handleCardClick = () => {
    if (!auth.currentUser) {
      setShowModal(true);
    }
  };

  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'Medical': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-800';
      case 'Herbal': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
      default: return 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-100 dark:border-purple-800';
    }
  };

  const getGradeStyles = (grade?: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20';
      case 'B': return 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20';
      case 'C': return 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/20';
      default: return 'bg-slate-500 text-white border-slate-400';
    }
  };

  const displayCategory = item.category === 'Medical' ? t.common.medical : item.category === 'Herbal' ? t.common.herbal : item.category;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleCardClick}
        className={`group relative h-full cursor-pointer ${isBlurred ? 'blur-[8px] select-none opacity-50' : ''}`}
      >
        {/* Dynamic Glow Background */}
        {!isBlurred && (
          <div className={`absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl rounded-[48px] pointer-events-none ${
            item.category === 'Medical' ? 'bg-blue-500/10' : 
            item.category === 'Herbal' ? 'bg-emerald-500/10' : 'bg-purple-500/10'
          }`} />
        )}

        <div className={`relative bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-500 flex flex-col h-full shadow-sm ${!isBlurred ? 'hover:border-blue-500/30 hover:shadow-2xl' : ''}`}>
          <div className="h-60 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
            {/* Animated decorative background */}
            <motion.div 
              whileHover={!isBlurred ? { scale: 1.1, rotate: 1 } : {}}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`absolute inset-0 opacity-20 ${
                item.category === 'Medical' ? 'bg-gradient-to-br from-blue-400 via-indigo-600 to-blue-800' : 
                item.category === 'Herbal' ? 'bg-gradient-to-br from-emerald-400 via-teal-600 to-emerald-800' : 
                'bg-gradient-to-br from-purple-400 via-violet-600 to-purple-800'
              }`} 
            />
            
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
              <div className="flex flex-col gap-2">
                <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-lg ${getCategoryStyles(item.category)}`}>
                  {displayCategory}
                </span>
                {item.evidenceGrade && (
                  <span className={`w-fit px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-lg backdrop-blur-md ${getGradeStyles(item.evidenceGrade)}`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Grade {item.evidenceGrade}
                  </span>
                )}
              </div>

              <button 
                onClick={toggleBookmark}
                className={`w-12 h-12 rounded-2xl relative z-20 ${isBookmarked ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-white'} backdrop-blur-md flex items-center justify-center shadow-lg transition-all active:scale-90`}
              >
                {isBookmarked ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
              </button>
            </div>

            {/* Content Type Badge */}
            <div className="absolute bottom-6 left-6 z-10">
              <div className="px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md flex items-center gap-2 border border-white/20">
                {item.type === 'video' ? <PlayCircle className="w-4 h-4 text-white" /> : <FileText className="w-4 h-4 text-white" />}
                <span className="text-[9px] font-black text-white uppercase tracking-widest">{item.type}</span>
              </div>
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-xs font-black text-blue-600 shadow-inner">
                {item.source.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{item.source}</span>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 opacity-60">
                  <Clock className="w-3 h-3" />
                  {item.date}
                </div>
              </div>
            </div>

            <h3 className={`font-black text-2xl text-slate-900 dark:text-white mb-4 line-clamp-2 leading-[1.2] transition-colors tracking-tight ${!isBlurred ? 'group-hover:text-blue-600' : ''}`}>
              {item.title}
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 line-clamp-3 flex-1 font-medium leading-relaxed opacity-80 transition-opacity">
              {item.excerpt}
            </p>

            <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800/50 mt-auto">
              {item.isVerified ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5" strokeWidth={3} />
                  Verified
                </div>
              ) : (
                 <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full border border-transparent hover:border-slate-200 transition-all">
                  Insight
                </div>
              )}
              
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!auth.currentUser) {
                      setShowModal(true);
                    }
                  }}
                  className={`p-3 text-slate-400 rounded-2xl transition-all active:scale-90 relative z-20 ${!isBlurred ? 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20' : ''}`}
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <a 
                  href={!auth.currentUser ? '#' : item.link} 
                  target={!auth.currentUser ? undefined : "_blank"} 
                  rel={!auth.currentUser ? undefined : "noopener noreferrer"} 
                  className={`p-3 text-slate-400 rounded-2xl transition-all active:scale-90 relative z-20 ${!isBlurred ? 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20' : ''}`}
                  onClick={(e) => {
                    if (!auth.currentUser) {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowModal(true);
                    }
                  }}
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <RestrictedAccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
