import React from 'react';
import { ArrowLeft, Check, Award, Download, GraduationCap, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { LearningPath } from '@/services/learningService';

interface CourseHeaderProps {
  path: LearningPath;
  t: any;
  isEnrolled: boolean;
  enrolling: boolean;
  isOffline: boolean;
  handleEnroll: () => void;
  handleDownload: () => void;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  path,
  t,
  isEnrolled,
  enrolling,
  isOffline,
  handleEnroll,
  handleDownload,
}) => {
  return (
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
              <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-1">{path.progress || 0}%</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('complete')}</div>
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-none active:scale-95 disabled:opacity-50"
                >
                  {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
                  Enroll Now
                </button>
              ) : (
                <>
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
                      className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-400 transition-all shadow-lg active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      {t('download')}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
