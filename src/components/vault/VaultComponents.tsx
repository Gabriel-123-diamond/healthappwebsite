import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Upload, FileText, Trash2, Search, 
  Plus, Loader2, Lock, Calendar, File, Activity, ExternalLink, ArrowLeft
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { MedicalRecord } from '@/services/vaultService';
import { useTranslations } from 'next-intl';

export const VaultLockedState = () => {
  const t = useTranslations('vault');
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-[28px] flex items-center justify-center text-amber-600 mx-auto mb-8">
          <Lock size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
          {t('lockedTitle').split(' ')[0]} <span className="text-amber-500">{t('lockedTitle').split(' ')[1]}</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
          {t('lockedDesc')}
        </p>
        <Link href="/upgrade" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
          {t('scaleAuthority')} <Plus size={14} />
        </Link>
      </div>
    </div>
  );
};

export const EmptyVaultState = () => {
  const t = useTranslations('vault');
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-dashed border-slate-200 dark:border-white/10 p-20 text-center">
      <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 mx-auto mb-6">
        <FileText size={32} />
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{t('emptyTitle')}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('emptyDesc')}</p>
    </div>
  );
};

export const VaultHeader = ({ 
  isViewingOthers, 
  targetName, 
  uploading, 
  handleFileUpload 
}: { 
  isViewingOthers: boolean, 
  targetName: string | null, 
  uploading: boolean, 
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void 
}) => {
  const t = useTranslations('vault');
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
      <div className="space-y-4">
        <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2">
          <ArrowLeft size={12} /> Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <Shield size={24} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {isViewingOthers ? `${targetName}'s` : t('title').split(' ')[0]} <span className="text-emerald-600">{isViewingOthers ? 'Vault.' : t('title').split(' ')[1]}</span>
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
          {isViewingOthers 
            ? t('sharedSubtitle')
            : t('subtitle')}
        </p>
      </div>

      {!isViewingOthers && (
        <div className="flex items-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? t('uploading') : t('uploadRecord')}
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      )}
    </header>
  );
};

export const VaultSearchAndStats = ({ 
  searchQuery, 
  setSearchQuery, 
  recordCount 
}: { 
  searchQuery: string, 
  setSearchQuery: (v: string) => void, 
  recordCount: number 
}) => {
  const t = useTranslations('vault');
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div className="md:col-span-3 relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
        />
      </div>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-100 dark:border-white/5 flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
          <File size={18} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('totalNodes')}</p>
          <p className="text-lg font-black text-slate-900 dark:text-white">{recordCount}</p>
        </div>
      </div>
    </div>
  );
};

export const VaultRecordCard = ({ 
  record, 
  isViewingOthers, 
  onDelete,
  onDownload
}: { 
  record: MedicalRecord, 
  isViewingOthers: boolean, 
  onDelete: (id: string, url: string) => void,
  onDownload: (record: MedicalRecord) => void
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-white/5 group hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-500/5"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
        <FileText size={24} />
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => onDownload(record)}
          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400 hover:text-blue-600 transition-colors"
        >
          {record.isEncrypted && <Lock size={12} className="absolute -top-1 -right-1 text-emerald-500" />}
          <ExternalLink size={18} />
        </button>
        {!isViewingOthers && (
          <button 
            onClick={() => onDelete(record.id!, record.url)}
            className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate mb-1">
      {record.name}
    </h4>
    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(record.uploadedAt?.seconds * 1000).toLocaleDateString()}</span>
      <span className="flex items-center gap-1.5"><Activity size={12} /> {(record.size / 1024 / 1024).toFixed(2)} MB</span>
    </div>
  </motion.div>
);
