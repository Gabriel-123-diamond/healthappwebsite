import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Plus, Trash2, Calendar, Activity, 
  Lock
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SymptomLog } from '@/services/journalService';
import { useTranslations } from 'next-intl';

export const JournalLockedState = () => {
  const t = useTranslations('journal');
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-[28px] flex items-center justify-center text-rose-600 mx-auto mb-8">
          <Lock size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
          {t('lockedTitle').split(' ')[0]} <span className="text-rose-600">{t('lockedTitle').split(' ')[1]}</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
          {t('lockedDesc')}
        </p>
        <Link href="/upgrade" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
          Scale Authority Node <Plus size={14} />
        </Link>
      </div>
    </div>
  );
};

export const EmptyJournalState = () => {
  const t = useTranslations('journal');
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-dashed border-slate-200 dark:border-white/10 p-20 text-center">
      <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 mx-auto mb-6">
        <BookOpen size={32} />
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{t('emptyTitle')}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('emptyDesc')}</p>
    </div>
  );
};

export const AddJournalEntryForm = ({
  symptoms, setSymptoms,
  severity, setSeverity,
  notes, setNotes,
  onSubmit, onCancel,
  submitting
}: {
  symptoms: string, setSymptoms: (v: string) => void,
  severity: number, setSeverity: (v: number) => void,
  notes: string, setNotes: (v: string) => void,
  onSubmit: (e: React.FormEvent) => void,
  onCancel: () => void,
  submitting: boolean
}) => {
  const t = useTranslations('journal');
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-rose-500/20 shadow-2xl mb-12"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t('formSymptoms')}</label>
          <input 
            required
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            placeholder={t('formSymptomsPlaceholder')}
            className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-rose-500/20 outline-none"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t('formSeverity')}</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setSeverity(level)}
                className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${
                  severity === level 
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                    : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t('formNotes')}</label>
          <textarea 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={t('formNotesPlaceholder')}
            rows={3}
            className="w-full p-5 bg-slate-50 dark:bg-white/5 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-rose-500/20 outline-none resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="submit"
            disabled={submitting}
            className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all disabled:opacity-50"
          >
            {submitting ? t('formSubmitting') : t('formSubmit')}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            {t('formCancel')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export const JournalEntryCard = ({ log, onDelete }: { log: SymptomLog, onDelete: (id: string) => void }) => {
  const t = useTranslations('journal');
  const formatDate = (dateValue: any) => {
    if (!dateValue) return t('initialPhase');
    
    // Handle Firestore Timestamp
    if (dateValue.seconds) {
      return new Date(dateValue.seconds * 1000).toLocaleString(undefined, { 
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
    }
    
    // Handle JS Date or ISO string
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "Processing...";
    
    return date.toLocaleString(undefined, { 
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="relative pl-8 md:pl-12 group">
      {/* Timeline Dot */}
      <div className="absolute left-[-9px] top-2 w-4 h-4 rounded-full bg-slate-50 dark:bg-slate-900 border-2 border-rose-500 shadow-sm" />
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-rose-500/20 transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Calendar size={12} />
            {formatDate(log.loggedAt)}
          </div>
          <button 
            onClick={() => onDelete(log.id!)}
            className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {log.symptoms.map(sym => (
          <span key={sym} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 text-xs font-bold rounded-lg border border-rose-100 dark:border-rose-500/20">
            {sym}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-slate-200 dark:border-white/10">
          <Activity size={14} className={log.severity >= 4 ? 'text-red-500' : 'text-slate-400'} />
          <span>{t('severityLabel')}: {log.severity}/5</span>
        </div>
        <p className="flex-1 italic">
          {log.notes || t('noNotes')}
        </p>
      </div>
    </div>
  </div>
);
};
