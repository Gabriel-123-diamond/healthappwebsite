import React from 'react';
import { Appointment } from '@/types/appointment';
import { Calendar, Clock, MessageSquare, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface AppointmentCardProps {
  appointment: Appointment;
  onChatClick: (expertId: string, expertName: string) => void;
}

export default function AppointmentCard({ appointment, onChatClick }: AppointmentCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-8 transition-all duration-500 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/5 group">
      <div className="flex-1 flex items-center gap-6">
        <div className="w-16 h-16 rounded-[20px] bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-black text-2xl text-blue-600 border border-slate-100 dark:border-slate-700 transition-transform duration-500 group-hover:scale-110 shadow-inner">
          {appointment.expertName[0]}
        </div>
        
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors truncate">
              {appointment.expertName}
            </h3>
            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
              appointment.status === 'confirmed' 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800' 
                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800'
            }`}>
              {appointment.status}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                <Calendar size={14} className="text-slate-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{new Date(appointment.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                <Clock size={14} className="text-slate-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{appointment.time}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-6 md:pt-0 border-t md:border-t-0 border-slate-50 dark:border-slate-800/50">
        <button 
          onClick={() => onChatClick(appointment.expertId, appointment.expertName)}
          className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-[20px] font-black uppercase tracking-widest text-[10px] border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 hover:text-blue-600 transition-all shadow-sm active:scale-95 group/btn"
        >
          <MessageSquare className="w-4 h-4 transition-transform group-active/btn:scale-125" />
          Secure Chat
        </button>
        
        <Link 
          href={`/directory/${appointment.expertId}`}
          title="View Expert Profile"
          className="hidden sm:flex w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-500 active:scale-90 shadow-sm"
        >
           <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
}
