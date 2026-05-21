import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Trash2, Clock, Lock, Pill, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { MedicationReminder } from '@/services/reminderService';

export const RemindersLockedState = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-20">
    <div className="max-w-2xl mx-auto px-4 text-center">
      <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-[28px] flex items-center justify-center text-indigo-600 mx-auto mb-8">
        <Lock size={40} />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
        Reminders <span className="text-indigo-600">Locked.</span>
      </h1>
      <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
        Medication Reminders are an ELITE clinical protocol. Upgrade to enable automated scheduling and adherence tracking for your clinical node.
      </p>
      <Link href="/upgrade" className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
        Unlock ELITE Protocol <Plus size={14} />
      </Link>
    </div>
  </div>
);

export const EmptyRemindersState = () => (
  <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-dashed border-slate-200 dark:border-white/10 p-20 text-center">
    <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 mx-auto mb-6">
      <Clock size={32} />
    </div>
    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">No Active Nodes</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Your medication schedule is clear. Add a new reminder to begin tracking adherence.</p>
  </div>
);

export const AddReminderForm = ({
  medName, setMedName,
  dosage, setDosage,
  time, setTime,
  onSubmit, onCancel,
  submitting
}: {
  medName: string, setMedName: (v: string) => void,
  dosage: string, setDosage: (v: string) => void,
  time: string, setTime: (v: string) => void,
  onSubmit: (e: React.FormEvent) => void,
  onCancel: () => void,
  submitting: boolean
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-indigo-500/20 shadow-2xl mb-8"
  >
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Medication Name</label>
        <input 
          required
          value={medName}
          onChange={e => setMedName(e.target.value)}
          placeholder="e.g. Paracetamol"
          className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Dosage</label>
        <input 
          required
          value={dosage}
          onChange={e => setDosage(e.target.value)}
          placeholder="e.g. 500mg"
          className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Schedule Time</label>
        <input 
          type="time"
          required
          value={time}
          onChange={e => setTime(e.target.value)}
          className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
        />
      </div>
      <div className="flex gap-2">
        <button 
          type="submit"
          disabled={submitting}
          className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg disabled:opacity-50 transition-all hover:bg-indigo-700"
        >
          {submitting ? "Deploying..." : "Activate"}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="px-6 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-slate-200"
        >
          Cancel
        </button>
      </div>
    </form>
  </motion.div>
);

export const ReminderCard = ({ 
  reminder, 
  onToggle, 
  onDelete 
}: { 
  reminder: MedicationReminder, 
  onToggle: (id: string, current: boolean) => void, 
  onDelete: (id: string) => void 
}) => (
  <div className={`bg-white dark:bg-slate-900 p-6 rounded-[32px] border ${reminder.isActive ? 'border-slate-100 dark:border-white/5 shadow-sm' : 'border-slate-100/50 dark:border-white/5 opacity-60'} transition-all`}>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl ${reminder.isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
        <Pill size={24} />
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onToggle(reminder.id!, reminder.isActive)}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
        >
          {reminder.isActive ? <ToggleRight size={28} className="text-indigo-600" /> : <ToggleLeft size={28} />}
        </button>
        <button 
          onClick={() => onDelete(reminder.id!)}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 truncate">{reminder.medicationName}</h4>
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
        {reminder.dosage}
      </span>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {reminder.frequency}
      </span>
    </div>
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-xs pt-4 border-t border-slate-50 dark:border-white/5">
      <Clock size={14} className="text-slate-400" />
      <span>Scheduled: {reminder.times[0]}</span>
    </div>
  </div>
);
