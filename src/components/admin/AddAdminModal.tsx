import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, Loader2, Key } from 'lucide-react';
import { PasswordField } from '@/components/common/PasswordField';

interface AddAdminModalProps {
  showAddAdmin: boolean;
  setShowAddAdmin: (show: boolean) => void;
  adminName: string;
  setAdminName: (name: string) => void;
  adminEmail: string;
  setAdminEmail: (email: string) => void;
  adminPass: string;
  setAdminPass: (pass: string) => void;
  creatingAdmin: boolean;
  handleCreateAdmin: (e: React.FormEvent) => void;
}

export function AddAdminModal({
  showAddAdmin,
  setShowAddAdmin,
  adminName,
  setAdminName,
  adminEmail,
  setAdminEmail,
  adminPass,
  setAdminPass,
  creatingAdmin,
  handleCreateAdmin,
}: AddAdminModalProps) {
  if (!showAddAdmin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden p-10 border border-white/10"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Initialize Admin</h2>
          <button onClick={() => setShowAddAdmin(false)}><XCircle className="text-slate-300" /></button>
        </div>
        <form onSubmit={handleCreateAdmin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Display Name</label>
            <input 
              required 
              type="text" 
              value={adminName} 
              onChange={e => setAdminName(e.target.value)} 
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-none outline-none font-bold text-sm" 
              placeholder="Protocol Officer" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Email Identity</label>
            <input 
              required 
              type="email" 
              value={adminEmail} 
              onChange={e => setAdminEmail(e.target.value)} 
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-none outline-none font-bold text-sm" 
              placeholder="admin@ikike.health" 
            />
          </div>
          <div className="space-y-2 pb-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Security Key</label>
            <PasswordField
              id="admin-password"
              name="admin-password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              placeholder="••••••••"
              className="dark:bg-white/5"
            />
          </div>
          <button 
            disabled={creatingAdmin} 
            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            {creatingAdmin ? <Loader2 className="animate-spin" /> : <><Key size={16}/> Activate Access</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
