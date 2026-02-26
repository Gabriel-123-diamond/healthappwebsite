import { Shield, ShieldCheck, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

interface VerificationCardProps {
  status: 'unverified' | 'pending' | 'verified' | 'rejected';
  type?: string;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ status, type }) => {
  const getUI = () => {
    switch (status) {
      case 'verified':
        return {
          icon: <ShieldCheck className="text-white w-6 h-6" />,
          title: "Verified Pro",
          desc: "Full access granted.",
          color: "bg-emerald-600",
          glow: "shadow-emerald-500/40"
        };
      case 'pending':
        return {
          icon: <Clock className="text-white w-6 h-6" />,
          title: "In Review",
          desc: "Verification in progress.",
          color: "bg-amber-500",
          glow: "shadow-amber-500/40"
        };
      case 'rejected':
        return {
          icon: <ShieldAlert className="text-white w-6 h-6" />,
          title: "Action Needed",
          desc: "Verification failed.",
          color: "bg-red-600",
          glow: "shadow-red-500/40"
        };
      default:
        return {
          icon: <Shield className="text-white w-6 h-6" />,
          title: "Unverified",
          desc: "Limited access.",
          color: "bg-slate-600",
          glow: "shadow-slate-500/40"
        };
    }
  };

  const ui = getUI();

  return (
    <div className="relative group overflow-hidden bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm transition-all duration-500 hover:shadow-2xl">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className={`w-14 h-14 rounded-2xl ${ui.color} ${ui.glow} flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
            {ui.icon}
          </div>
          {status === 'verified' && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
            </motion.div>
          )}
        </div>

        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</span>
            <div className={`w-1.5 h-1.5 rounded-full ${ui.color} animate-pulse`} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{ui.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{ui.desc}</p>
        </div>

        <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specialty Type</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{type || 'Medical Expert'}</span>
            </div>
            
            {status !== 'verified' && status !== 'pending' ? (
              <Link 
                href="/expert/verify" 
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                Apply
              </Link>
            ) : (
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Shield className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative glass flare */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
    </div>
  );
};
