'use client';

import React, { useEffect, useState } from 'react';
import { getLearningPaths, LearningPath } from '@/services/learningService';
import { Activity, Leaf, Moon, BookOpen, ArrowRight, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LearningPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [offlinePaths, setOfflinePaths] = useState<string[]>([]);

  useEffect(() => {
    getLearningPaths().then(data => {
      setPaths(data);
      setLoading(false);
    });

    const offline = Object.keys(localStorage).filter(k => k.startsWith('learning-path-')).map(k => k.replace('learning-path-', ''));
    setOfflinePaths(offline);
  }, []);

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
      case 'Medical': return 'bg-blue-100 text-blue-700';
      case 'Herbal': return 'bg-emerald-100 text-emerald-700';
      case 'Lifestyle': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Learning Paths</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Structured courses designed to help you master your health. 
            From managing chronic conditions to understanding natural remedies.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {paths.map((path, index) => {
              const isOffline = offlinePaths.includes(path.id);
              return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                {/* Progress Bar Background */}
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-1000"
                  style={{ width: `${path.progress}%` }}
                />

                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(path.category)} bg-opacity-50`}>
                    {getIcon(path.icon)}
                  </div>
                  <div className="flex gap-2">
                    {isOffline && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Offline
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryColor(path.category)}`}>
                      {path.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {path.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {path.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <BookOpen className="w-4 h-4" />
                    <span>{path.totalModules} Modules</span>
                  </div>
                  
                  {path.progress > 0 ? (
                    <span className="font-bold text-blue-600">{path.progress}% Complete</span>
                  ) : (
                    <span className="text-slate-400">Not Started</span>
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
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
