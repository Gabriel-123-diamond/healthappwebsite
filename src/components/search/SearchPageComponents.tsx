import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronLeft, ChevronRight, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';

export const SearchLoading = ({ query, t }: { query: string, t: any }) => (
  <motion.div 
    key="loading" 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, scale: 0.95 }} 
    className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none" />
    <div className="relative mb-10">
      <motion.div 
        animate={{ 
          rotate: 360, 
          borderRadius: ["30%", "50%", "30%"],
          scale: [1, 1.1, 1]
        }} 
        transition={{ 
          repeat: Infinity, 
          duration: 4, 
          ease: "easeInOut" 
        }} 
        className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/20 flex items-center justify-center relative z-10"
      >
        <Sparkles className="w-10 h-10 text-white" />
      </motion.div>
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        className="absolute inset-[-15px] border-2 border-dashed border-blue-200 dark:border-blue-900/30 rounded-full" 
      />
    </div>
    <motion.h2 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter"
    >
      {t('loadingTitle')}
    </motion.h2>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-slate-500 dark:text-slate-400 font-medium px-6 text-center"
    >
      {t('loadingSubtitle', { query })}
    </motion.p>
  </motion.div>
);

export const SearchError = ({ error, onRetry, t }: { error: string, onRetry: () => void, t: any }) => (
  <motion.div 
    key="error"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="text-center py-20"
  >
    <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-8 rounded-[32px] inline-block max-w-md border border-red-100 dark:border-red-900/30 shadow-2xl shadow-red-500/5 transition-colors">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <p className="font-black text-xl mb-2 uppercase tracking-tight">{t('failedTitle')}</p>
      <p className="text-sm font-medium opacity-80 mb-6">{error}</p>
      <button 
        onClick={onRetry} 
        className="w-full bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-lg active:scale-95"
      >
        {t('failedRetry')}
      </button>
    </div>
  </motion.div>
);

export const EmptySearchState = ({ t }: { t: any }) => (
  <motion.div 
    key="empty"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-32 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden"
  >
     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />
     <motion.div 
       initial={{ scale: 0.8, opacity: 0 }}
       animate={{ scale: 1, opacity: 1 }}
       transition={{ type: "spring", stiffness: 200, damping: 15 }}
       className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner"
     >
        <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-600" />
     </motion.div>
     <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">{t('initTitle')}</h3>
     <p className="text-slate-500 dark:text-slate-400 font-medium px-8">{t('initSubtitle')}</p>
  </motion.div>
);

export const LoggedOutSearchBanner = () => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 100, damping: 20 }}
    className="bg-blue-600 rounded-[32px] p-8 sm:p-12 text-white relative overflow-hidden group shadow-2xl shadow-blue-500/20"
  >
    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-1000" />
    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
      <div className="space-y-6 max-w-xl">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-white/10"
        >
          <Lock size={12} strokeWidth={3} />
          Intelligence Locked
        </motion.div>
        <h3 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none uppercase">
          Initialize Identity for <span className="text-blue-200">Full Access.</span>
        </h3>
        <p className="text-lg font-medium text-blue-50/80 leading-relaxed">
          Sign in or create your intelligence node to unlock comprehensive clinical articles, expert consultations, and encrypted health learning paths.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-5 shrink-0">
        <Link href="/auth/signin" className="w-full sm:w-auto px-10 py-5 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95">
          <LogIn size={16} strokeWidth={3} /> Sign In
        </Link>
        <Link href="/auth/signup" className="w-full sm:w-auto px-10 py-5 bg-blue-700/50 text-white border-2 border-white/20 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-800 transition-all flex items-center justify-center gap-3 backdrop-blur-md active:scale-95">
          <UserPlus size={16} strokeWidth={3} /> Create Node
        </Link>
      </div>
    </div>
  </motion.div>
);

export const Pagination = ({ t, currentPage, totalPages, totalResults, itemsPerPage, handlePageChange, customPage, setCustomPage, handleCustomPageSubmit }: any) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-12 border-t border-slate-200 dark:border-slate-800"
  >
    <div className="flex flex-col items-center lg:items-start gap-1">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {t('showing')} <span className="text-slate-900 dark:text-white font-black">{(currentPage - 1) * itemsPerPage + 1}</span> {t('to')} <span className="text-slate-900 dark:text-white font-black">{Math.min(currentPage * itemsPerPage, totalResults)}</span> {t('of')} <span className="text-slate-900 dark:text-white font-black">{totalResults}</span> {t('results')}
      </p>
      <div className="h-1 w-full max-w-[200px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentPage / totalPages) * 100}%` }}
          className="h-full bg-blue-600 rounded-full"
        />
      </div>
    </div>

    <div className="flex items-center gap-3">
      <button 
        onClick={() => handlePageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
        className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all active:scale-90"
      >
        <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </button>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let p = totalPages > 5 && currentPage > 3 ? currentPage - 3 + i : i + 1;
          if (p > totalPages) return null;
          return (
            <button 
              key={p} 
              onClick={() => handlePageChange(p)} 
              className={`w-12 h-12 rounded-2xl text-xs font-black transition-all active:scale-90 ${
                currentPage === p 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button 
        onClick={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage === totalPages} 
        className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all active:scale-90"
      >
        <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </button>
    </div>

    <form onSubmit={handleCustomPageSubmit} className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-3">{t('goToPage')}</span>
      <input 
        type="number" 
        min="1" 
        max={totalPages} 
        value={customPage} 
        onChange={(e) => setCustomPage(e.target.value)} 
        className="w-16 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-black text-center focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" 
      />
    </form>
  </motion.div>
);
