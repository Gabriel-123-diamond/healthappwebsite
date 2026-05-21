import React from 'react';
import { ShieldCheck, Video } from 'lucide-react';

interface CallLobbyProps {
  onJoin: () => void;
}

export const CallLobby: React.FC<CallLobbyProps> = ({ onJoin }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 pt-32 sm:pt-40 transition-colors">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black uppercase tracking-widest">
            <ShieldCheck size={14} />
            End-to-End Encrypted
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
            Secure <span className="text-blue-600">Protocol</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
            You are about to join a private clinical node for your appointment. Ensure your credentials and hardware are ready.
          </p>
          <button 
            onClick={onJoin}
            className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black uppercase tracking-widest text-sm transition-all shadow-2xl shadow-blue-500/20 active:scale-95"
          >
            Initialize Session
          </button>
        </div>

        <div className="relative aspect-video bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-white/5 overflow-hidden flex items-center justify-center group shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 dark:from-slate-950 to-transparent opacity-60" />
           <div className="text-center space-y-4 relative z-10">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform duration-500">
                <Video size={32} className="text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[10px]">Preview Unavailable</p>
           </div>
        </div>
      </div>
    </div>
  );
};
