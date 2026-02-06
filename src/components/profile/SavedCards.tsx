'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Calendar, Stethoscope, Leaf, Sparkles } from 'lucide-react';
import { SavedItem, SavedSearch } from '@/services/bookmarkService';

interface SavedItemCardProps {
  item: SavedItem;
  onDelete: (id: string) => void;
  t: any;
}

export const SavedItemCard: React.FC<SavedItemCardProps> = ({ item, onDelete, t }) => {
  const getIcon = () => {
    switch (item.category) {
      case 'Medical': return <Stethoscope className="w-5 h-5 text-blue-600" />;
      case 'Herbal': return <Leaf className="w-5 h-5 text-emerald-600" />;
      default: return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
  };

  const getColorClass = () => {
    switch (item.category) {
      case 'Medical': return 'bg-blue-50 border-blue-100 text-blue-700';
      case 'Herbal': return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      default: return 'bg-purple-50 border-purple-100 text-purple-700';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group relative"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getColorClass()}`}>
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.title}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${getColorClass()}`}>
                {item.category}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3 pr-8">
              {item.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {t.saved.savedOn} {item.date}
              </div>
              <div>Source: {item.source}</div>
              {item.evidenceGrade && (
                <div className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                  Grade {item.evidenceGrade}
                </div>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => onDelete(item.id)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export const SavedSearchCard: React.FC<{ search: SavedSearch, onDelete: () => void }> = ({ search, onDelete }) => {
  return (
    <motion.div layout className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all relative">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{search.query}</h3>
          
          {search.response?.answer && (
            <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4 leading-relaxed">
              {search.response.answer}
            </p>
          )}

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded uppercase tracking-wider">
              {search.mode}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
               <Calendar className="w-3 h-3" />
               Saved on {new Date(search.timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
          title="Delete saved search"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
