import React from 'react';
import { Key, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AccessCodeManager } from '@/components/expert/AccessCodeManager';
import { AccessCode } from '@/services/expertDashboardService';

interface AccessCodeNodeProps {
  accessCodes: AccessCode[];
  loadingCodes: boolean;
  isGenerating: boolean;
  onDeleteCode: (id: string) => void;
  onCopyCode: (code: string) => void;
  onOpenExpiryModal: () => void;
}

export const AccessCodeNode: React.FC<AccessCodeNodeProps> = ({
  accessCodes,
  loadingCodes,
  isGenerating,
  onDeleteCode,
  onCopyCode,
  onOpenExpiryModal,
}) => {
  const hasActiveCode = accessCodes.some(c => new Date(c.expiresAt) > new Date());

  return (
    <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Access Code Node</h4>
          </div>
          {hasActiveCode && (
             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
          )}
       </div>

       <div className="space-y-6">
          <AccessCodeManager 
            codes={accessCodes}
            loading={loadingCodes}
            onDelete={onDeleteCode}
            onCopy={onCopyCode}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenExpiryModal}
            disabled={isGenerating}
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg hover:shadow-indigo-500/10"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
            Generate New Code
          </motion.button>
       </div>
    </div>
  );
};
