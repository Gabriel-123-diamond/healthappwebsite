'use client';

import React, { useState } from 'react';
import { Calendar, Loader2, FileText, ExternalLink, BookOpen, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Article } from '@/types/article';
import { LearningPath } from '@/types/learning';
import { Appointment } from '@/types/appointment';
import { AIScribeModal } from './AIScribeModal';

export const AppointmentList = ({ appointments }: { appointments: Appointment[] }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  return (
    <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
      <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
            <Calendar className="text-blue-600 dark:text-blue-400 w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Consultation Log</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{appointments.length} Total</span>
        </div>
      </div>
      <div className="p-2">
        {appointments.length === 0 ? (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">No active consultations</p>
            <p className="text-[10px] text-slate-400 font-medium px-10">Your clinical schedule will appear here once patients begin booking sessions.</p>
          </div>
        ) : (
          appointments.map(app => (
            <div key={app.id} className="p-6 sm:p-8 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-[32px] group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                  <span className="text-[8px] font-black uppercase tracking-tighter leading-none mb-1">{app.date.split(' ')[0]}</span>
                  <span className="text-xl font-black leading-none">{app.date.split(' ')[1]?.replace(',', '') || '12'}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Patient Session</h3>
                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                      app.status === 'confirmed' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100' :
                      app.status === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100' :
                      'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100'
                    }`}>{app.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                        {app.time}
                    </div>
                    <div className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <span>Paid: ₦{app.fee || '2,500'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedAppointment(app)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Scribe
                </button>
                <Link href={`/expert/appointments/${app.id}`} className="px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/10 active:scale-95 transition-all">
                  Initialize
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <AIScribeModal 
        isOpen={!!selectedAppointment} 
        onClose={() => setSelectedAppointment(null)} 
        patientName="Patient Session" 
      />
    </div>
  );
};

export const ArticleList = ({ articles, onCreationAttempt }: { articles: Article[], onCreationAttempt?: (e: React.MouseEvent, type: 'article' | 'course') => void }) => (
  <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
    <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
          <FileText className="text-blue-600 dark:text-blue-400 w-5 h-5" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Record Inventory</h2>
      </div>
      <button 
        onClick={(e) => onCreationAttempt?.(e, 'article')}
        className="px-5 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
      >
        Write New
      </button>
    </div>
    <div className="p-2">
      {articles.length === 0 ? (
        <div className="py-32 text-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-slate-200" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">No published documentation</p>
          <button 
            onClick={(e) => onCreationAttempt?.(e, 'article')}
            className="text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] hover:underline"
          >
            Initialize first entry
          </button>
        </div>
      ) : (
        articles.map(article => (
          <div key={article.id} className="p-6 sm:p-8 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-[32px] group">
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:text-blue-400 dark:group-hover:text-blue-400 transition-colors tracking-tight capitalize">{article.title}</h3>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${article.status === 'published' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100'}`}>{article.status}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{article.category}</span>
              </div>
            </div>
            <Link href={`/article/${article.id}`} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400 transition-all shadow-sm active:scale-90">
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        ))
      )}
    </div>
  </div>
);

export const CourseList = ({ courses, onCreationAttempt }: { courses: LearningPath[], onCreationAttempt?: (e: React.MouseEvent, type: 'article' | 'course') => void }) => (
  <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
    <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
          <BookOpen className="text-blue-600 dark:text-blue-400 w-5 h-5" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Learning Programs</h2>
      </div>
      <button 
        onClick={(e) => onCreationAttempt?.(e, 'course')}
        className="px-5 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
      >
        Initialize
      </button>
    </div>
    <div className="p-2">
      {courses.length === 0 ? (
        <div className="py-32 text-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-slate-200" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">No active curricula</p>
          <p className="text-[10px] text-slate-400 font-medium px-10 mb-6">Structured health intelligence paths for the community.</p>
          <button 
            onClick={(e) => onCreationAttempt?.(e, 'course')}
            className="text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] hover:underline"
          >
            Build first course
          </button>
        </div>
      ) : (
        courses.map(course => (
          <div key={course.id} className="p-6 sm:p-8 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-[32px] group">
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:text-blue-400 dark:group-hover:text-blue-400 transition-colors tracking-tight capitalize">{course.title}</h3>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${course.status === 'published' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100'}`}>{course.status}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.category}</span>
              </div>
            </div>
            <Link href={`/learning/path/${course.id}`} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400 transition-all shadow-sm active:scale-90">
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        ))
      )}
    </div>
  </div>
);
