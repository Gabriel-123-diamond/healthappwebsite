'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLearningPathById, LearningPath, Lesson, updateLessonProgress } from '@/services/learningService';
import { ArrowLeft, CheckCircle, Circle, PlayCircle, FileText, ChevronRight, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import ReactMarkdown from 'react-markdown';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const lessonId = params.lessonId as string;

  const [path, setPath] = useState<LearningPath | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setLoadingComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLearningPathById(id);
      if (data) {
        setPath(data);
        // Find the lesson in modules
        let foundLesson: Lesson | null = null;
        let next: Lesson | null = null;
        const flatLessons: Lesson[] = [];
        data.modules.forEach(m => {
          m.lessons.forEach(l => flatLessons.push(l));
        });
        
        const currentIndex = flatLessons.findIndex(l => l.id === lessonId);
        if (currentIndex !== -1) {
          foundLesson = flatLessons[currentIndex];
          if (currentIndex < flatLessons.length - 1) {
            next = flatLessons[currentIndex + 1];
          }
        }
        setCurrentLesson(foundLesson);
        setNextLesson(next);
      }
      setLoading(false);
    };
    fetchData();
  }, [id, lessonId]);

  const handleComplete = async () => {
    if (!path || !currentLesson) return;
    setLoadingComplete(true);
    
    // Find module ID
    let moduleId = '';
    path.modules.forEach(m => {
      if (m.lessons.find(l => l.id === lessonId)) moduleId = m.id;
    });

    try {
      await updateLessonProgress(path.id, moduleId, lessonId, true);
      // Redirect to next lesson or return to course home
      if (nextLesson) {
        router.push(`/learning/${path.id}/lesson/${nextLesson.id}`);
      } else {
        router.push(`/learning/${path.id}`);
      }
    } catch (error) {
      console.error("Failed to complete lesson:", error);
    } finally {
      setLoadingComplete(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!path || !currentLesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">LESSON NOT FOUND</h2>
        <Link href={`/learning/${id}`} className="text-blue-600 font-bold hover:underline uppercase tracking-widest text-sm">Return to Course</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 pt-16">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href={`/learning/${path.id}`} className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 group-hover:bg-slate-100 dark:group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Back to Course</p>
              <p className="text-xs font-bold truncate max-w-[200px] sm:max-w-md uppercase tracking-tight">{path.title}</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Progress</p>
              <p className="text-xs font-black text-blue-600 dark:text-blue-400">{path.progress}%</p>
            </div>
            <button 
              onClick={handleComplete}
              disabled={completing || currentLesson.isCompleted}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                currentLesson.isCompleted 
                ? 'bg-emerald-500 text-white cursor-default' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95'
              }`}
            >
              {completing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : currentLesson.isCompleted ? (
                <CheckCircle size={14} />
              ) : (
                <Circle size={14} />
              )}
              {currentLesson.isCompleted ? 'Completed' : 'Mark as Done'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-48 pb-32 px-4">
        <article className="max-w-3xl mx-auto">
          {/* Lesson Header */}
          <header className="mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
              <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                {currentLesson.type === 'video' ? 'Video Lesson' : 'Article Lesson'}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[1.1]">
              {currentLesson.title}
            </h1>

            <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <FileText size={14} />
                <span>Reading Time: {currentLesson.duration}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className={currentLesson.isCompleted ? 'text-emerald-500' : ''} />
                <span>{currentLesson.isCompleted ? 'Completed' : 'In Progress'}</span>
              </div>
            </div>
          </header>

          {/* Video Player or Placeholder */}
          {currentLesson.type === 'video' && (
            currentLesson.videoUrl ? (
              <div className="mb-16 aspect-video bg-black rounded-[40px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl">
                <iframe
                  src={currentLesson.videoUrl.replace('watch?v=', 'embed/').split('&')[0]} 
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="mb-16 aspect-video bg-slate-900 rounded-[40px] border border-white/5 flex flex-col items-center justify-center text-center p-12 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-50" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/20 mx-auto">
                    <PlayCircle size={40} className="text-white fill-white/20" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Video Content Missing</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium">The instructor has not provided a valid video URL for this lesson.</p>
                </div>
              </div>
            )
          )}

          {/* Article Content */}
          <div className="max-w-none text-slate-600 dark:text-slate-400">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-8 mt-12" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-6 mt-12" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white mb-4 mt-8" {...props} />,
                p: ({node, ...props}) => <p className="text-lg leading-relaxed mb-6" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="font-medium" {...props} />,
                strong: ({node, ...props}) => <strong className="font-black text-slate-900 dark:text-white" {...props} />,
                code: ({node, ...props}) => <code className="bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md font-bold text-blue-600" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-6 italic my-8 text-slate-500 dark:text-slate-400" {...props} />,
              }}
            >
              {currentLesson.content || 'Content coming soon...'}
            </ReactMarkdown>
          </div>

          {/* Footer Navigation */}
          <footer className="mt-24 pt-12 border-t border-slate-100 dark:border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Next Step</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {nextLesson ? `Up Next: ${nextLesson.title}` : 'You have reached the end of this course!'}
                </p>
              </div>
              <button 
                onClick={handleComplete}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-50"
                disabled={completing}
              >
                {completing ? <Loader2 size={16} className="animate-spin" /> : null}
                {nextLesson ? 'Complete & Continue' : 'Finish Course'}
                {nextLesson && <ChevronRight size={16} />}
              </button>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}
