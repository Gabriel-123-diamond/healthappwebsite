'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getLearningPathById, LearningPath, Module, Lesson } from '@/services/learningService';
import { ArrowLeft, PlayCircle, FileText, CheckCircle, Circle, Lock, Clock, ChevronDown, ChevronUp, Download, Check, Award } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LearningDetailPage() {
  const { id } = useParams();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof id === 'string') {
      const offlinePath = localStorage.getItem(`learning-path-${id}`);
      if (offlinePath) {
        setPath(JSON.parse(offlinePath));
        setIsOffline(true);
        setLoading(false);
      } else {
        getLearningPathById(id).then(data => {
          setPath(data || null);
          setLoading(false);
        });
      }
      // Expand first module by default
      if (path && path.modules.length > 0) {
        setExpandedModule(path.modules[0].id);
      }
    }
  }, [id, path]);

  const handleDownload = () => {
    if (path) {
      localStorage.setItem(`learning-path-${path.id}`, JSON.stringify(path));
      setIsOffline(true);
    }
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!path) return <div className="p-12 text-center">Path not found</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/learning" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Paths
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                  {path.category}
                </span>
                {isOffline && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                    <Check className="w-4 h-4" />
                    Available Offline
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{path.title}</h1>
              <p className="text-slate-600 max-w-2xl">{path.description}</p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="text-center bg-slate-50 px-6 py-4 rounded-xl border border-slate-100">
                <div className="text-3xl font-bold text-blue-600 mb-1">{path.progress}%</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Complete</div>
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                {path.progress === 100 && (
                  <Link
                    href={`/learning/certificate/${path.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors shadow-md shadow-amber-200"
                  >
                    <Award className="w-4 h-4" />
                    Claim Certificate
                  </Link>
                )}
                
                {!isOffline && (
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {path.modules.map((module, index) => (
            <div key={module.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <button 
                onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{module.title}</h3>
                </div>
                {expandedModule === module.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </button>

              <AnimatePresence>
                {expandedModule === module.id && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-slate-100"
                  >
                    <div className="divide-y divide-slate-100">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="p-4 pl-20 pr-6 flex items-center justify-between hover:bg-slate-50 group transition-colors">
                          <div className="flex items-center gap-4">
                            {lesson.type === 'video' ? <PlayCircle className="w-5 h-5 text-slate-400" /> : <FileText className="w-5 h-5 text-slate-400" />}
                            <div>
                              <p className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{lesson.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {lesson.duration}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button className="text-slate-300 hover:text-emerald-500 transition-colors">
                            {lesson.isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-emerald-500" />
                            ) : (
                              <Circle className="w-6 h-6" />
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
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <Lock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">Modules coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
