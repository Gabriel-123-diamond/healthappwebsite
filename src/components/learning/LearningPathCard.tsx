'use client';

import React from 'react';
import { Activity, Leaf, Moon, BookOpen, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { LearningPath } from '@/services/learningService';

interface LearningPathCardProps {
  path: LearningPath;
  index: number;
  isOffline: boolean;
}

export const LearningPathCard: React.FC<LearningPathCardProps> = ({ path, index, isOffline }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-6 h-6" />;
      case 'Leaf': return <Leaf className="w-6 h-6" />;
      case 'Moon': return <Moon className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Medical': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Herbal': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Lifestyle': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group relative overflow-hidden h-full flex flex-col"
    >
      <div 
        className="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-1000"
        style={{ width: `${path.progress}%` }}
      />

      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(path.category)}`}>
          {getIcon(path.icon)}
        </div>
        <div className="flex gap-2">
          {isOffline && (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Offline
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryColor(path.category)}`}>
            {path.category}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {path.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed flex-grow">
        {path.description}
      </p>

      <div className="flex items-center justify-between text-sm mt-auto">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500">
          <BookOpen className="w-4 h-4" />
          <span>{path.totalModules} Modules</span>
        </div>
        
        {path.progress > 0 ? (
          <span className="font-bold text-blue-600 dark:text-blue-400">{path.progress}% Complete</span>
        ) : (
          <span className="text-slate-400 dark:text-slate-600 font-bold">Not Started</span>
        )}
      </div>

      <Link 
        href={`/learning/${path.id}`}
        className="absolute inset-0 z-10 focus:outline-none"
        aria-label={`View ${path.title}`}
      />
      
      <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
        <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-blue-600" />
      </div>
    </motion.div>
  );
};
