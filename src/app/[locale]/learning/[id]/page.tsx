'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getLearningPathById, LearningPath, Module, Lesson } from '@/services/learningService';
import { ArrowLeft, PlayCircle, FileText, CheckCircle, Clock, ChevronDown, ChevronUp, Download, Lock, Check, Award, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function CourseDetailPage() {
  const t = useTranslations('learningPage');
  const params = useParams();
  const id = params.id as string;
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const fetchPath = async () => {
      const data = await getLearningPathById(id);
      if (data) {
        setPath(data);
        if (data.modules.length) setExpandedModule(data.modules[0].id);
      }
      setLoading(false);
    };
    fetchPath();
  }, [id]);

  const handleDownload = () => {
    setIsOffline(true);
    alert("Course downloaded for offline access.");
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest">{t('loading')}</div>;
  if (!path) return <div className="p-12 text-center">Course not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors pt-24 sm:pt-32 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/learning" className="inline-flex items-center text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToAll')}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {path.category}
                </span>
                {isOffline && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    <Check className="w-3 h-3" />
                    {t('availableOffline')}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-none uppercase">{path.title}</h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg leading-relaxed">{path.description}</p>
            </div>
            
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="text-center bg-white dark:bg-slate-800 px-8 py-6 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm w-full">
                <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-1">{path.progress}%</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('complete')}</div>
              </div>
              
              <div className="flex flex-col gap-3 w-full">
                {path.progress === 100 && (
                  <Link
                    href={`/learning/certificate/${path.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 dark:shadow-none active:scale-95"
                  >
                    <Award className="w-4 h-4" />
                    {t('claimCertificate')}
                  </Link>
                )}
                
                {!isOffline && (
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-400 transition-all shadow-lg active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    {t('download')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-6">
          {path.modules.map((module, index) => (
            <div key={module.id} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                className="w-full flex items-center justify-between p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
              >
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-sm border border-slate-200 dark:border-slate-700 shadow-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{t('modules')} {index + 1}</p>
                    <h3 className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">{module.title}</h3>
                  </div>
                </div>
                {expandedModule === module.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </button>

              <AnimatePresence>
                {expandedModule === module.id && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
                  >
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/30 dark:bg-black/10">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="p-6 pl-24 pr-8 flex items-center justify-between hover:bg-white dark:hover:bg-slate-800 transition-colors group">
                          <div className="flex items-center gap-5">
                            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">
                              {lesson.type === 'video' ? <PlayCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-black text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight text-sm">{lesson.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                                  <Clock className="w-3 h-3" /> {lesson.duration}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button className="text-slate-300 dark:text-slate-700 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors active:scale-90">
                            {lesson.isCompleted ? (
                              <CheckCircle className="w-7 h-7 text-emerald-500" />
                            ) : (
                              <Circle className="w-7 h-7" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          
          {path.modules.length === 0 && (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[48px] border border-dashed border-slate-300 dark:border-slate-700">
              <Lock className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-xs">{t('modulesComingSoon')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
