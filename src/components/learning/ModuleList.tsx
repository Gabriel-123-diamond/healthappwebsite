import React from 'react';
import { PlayCircle, FileText, CheckCircle, Clock, ChevronDown, Lock, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { LearningPath } from '@/services/learningService';

interface ModuleListProps {
  path: LearningPath;
  t: any;
  isEnrolled: boolean;
  expandedModule: string | null;
  setExpandedModule: (id: string | null) => void;
  handleEnroll: () => void;
}

export const ModuleList: React.FC<ModuleListProps> = ({
  path,
  t,
  isEnrolled,
  expandedModule,
  setExpandedModule,
  handleEnroll,
}) => {
  if (!isEnrolled) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[48px] p-12 text-center border border-slate-100 dark:border-white/5 shadow-3xl">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <Lock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Curriculum Locked</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium mb-10">Please enroll in this course to gain full clinical access to the learning modules and certification path.</p>
        <button
          onClick={handleEnroll}
          className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95"
        >
          Start My Enrollment
        </button>
      </div>
    );
  }

  return (
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
            {expandedModule === module.id ? <ChevronDown className="text-slate-400 rotate-180 transition-transform" /> : <ChevronDown className="text-slate-400 transition-transform" />}
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
                    <Link 
                      key={lesson.id} 
                      href={`/learning/${path.id}/lesson/${lesson.id}`}
                      className="p-6 pl-24 pr-8 flex items-center justify-between hover:bg-white dark:hover:bg-slate-800 transition-colors group"
                    >
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

                      <div className="flex items-center gap-6">
                        <div className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:bg-blue-500 dark:group-hover:border-blue-500 transition-all flex items-center gap-1 shadow-sm">
                          {lesson.type === 'video' ? 'WATCH' : 'READ'}
                        </div>
                        <div className="text-slate-300 dark:text-slate-700 transition-colors">
                          {lesson.isCompleted ? (
                            <CheckCircle className="w-7 h-7 text-emerald-500" />
                          ) : (
                            <Circle className="w-7 h-7" />
                          )}
                        </div>
                      </div>
                    </Link>
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
  );
};
