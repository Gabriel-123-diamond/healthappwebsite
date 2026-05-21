import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, User, Star, Trash2, Ban, CheckCircle, Loader2, Zap, Award, Crown } from 'lucide-react';
import { UserProfile, UserRole } from '@/types';
import { userService } from '@/services/userService';

interface UserEditModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onUpdate: (userId: string, updates: any) => void;
}

export function UserEditModal({ user, onClose, onUpdate }: UserEditModalProps) {
  const [fetching, setFetching] = useState(false);
  const [fetchedUser, setFetchedUser] = useState<UserProfile | null>(null);
  
  const [role, setRole] = useState<UserRole>('user');
  const [tier, setTier] = useState<any>('basic');
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      const fetchLatest = async () => {
        setFetching(true);
        try {
          const res = await fetch(`/api/admin/users/details?uid=${user.uid}`);
          if (!res.ok) throw new Error('Failed to fetch user details');
          
          const profile = await res.json();
          if (profile) {
            setFetchedUser(profile);
            setRole(profile.role);
            setTier(profile.tier || 'basic');
            setIsBanned(profile.isBanned || false);
          } else {
             // Fallback to prop data if fetch fails
             setFetchedUser(user);
             setRole(user.role);
             setTier(user.tier || 'basic');
             setIsBanned(user.isBanned || false);
          }
        } catch (error) {
          console.error("Error fetching latest user profile:", error);
          setFetchedUser(user);
          setRole(user.role);
          setTier(user.tier || 'basic');
          setIsBanned(user.isBanned || false);
        } finally {
          setFetching(false);
        }
      };
      fetchLatest();
    }
  }, [user?.uid]);

  if (!user) return null;

  const roles: { id: UserRole, icon: any }[] = [
    { id: 'user', icon: User },
    { id: 'doctor', icon: Shield },
    { id: 'hospital', icon: Shield },
    { id: 'wellness_practitioner', icon: Award },
    { id: 'admin', icon: Shield },
  ];

  const tiers = [
    { id: 'basic', icon: Zap },
    { id: 'vip1', icon: Award },
    { id: 'vip2', icon: Crown },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5"
        >
          {fetching && (
             <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-[2px] z-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
             </div>
          )}

          {/* Header */}
          <div className="p-8 border-b border-slate-50 dark:border-white/5 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Modify Citizen</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Intelligence Override</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Identity Info */}
            <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <User size={28} />
              </div>
              <div className="min-w-0">
                <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight truncate text-lg">{user.fullName || 'Anonymous Node'}</p>
                <p className="text-xs text-slate-400 font-bold truncate">{user.email}</p>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                 <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">Currently: {fetchedUser?.role || 'user'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${role === r.id ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-blue-500 shadow-xl' : 'border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'}`}
                  >
                    <r.icon size={14} className={role === r.id ? 'text-blue-500' : ''} />
                    {r.id.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Tier</label>
                 <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">Currently: {fetchedUser?.tier || 'basic'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {tiers.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTier(t.id as any)}
                    className={`flex flex-col items-center gap-2 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${tier === t.id ? 'bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20' : 'border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'}`}
                  >
                    <t.icon size={16} />
                    {t.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Toggles */}
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Restrictions</label>
               <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl hover:border-red-500/30 transition-all group">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-xl ${isBanned ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-slate-50 dark:bg-white/5 text-slate-300'}`}>
                     <Ban size={18} />
                   </div>
                   <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Restrict Access</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Currently: {fetchedUser?.isBanned ? 'BANNED' : 'ACTIVE'}</span>
                   </div>
                 </div>
                 <button 
                   onClick={() => setIsBanned(!isBanned)}
                   className={`w-14 h-7 rounded-full transition-all relative ${isBanned ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-slate-100 dark:bg-slate-800'}`}
                 >
                   <div className={`absolute top-1.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${isBanned ? 'right-1.5' : 'left-1.5'}`} />
                 </button>
               </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 bg-slate-50 dark:bg-white/5 flex gap-4">
            <button 
              onClick={onClose}
              disabled={fetching}
              className="flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Discard
            </button>
            <button 
              onClick={() => onUpdate(user.uid, { role, tier, isBanned })}
              disabled={fetching}
              className="flex-[2] bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/20 dark:shadow-none disabled:opacity-50"
            >
              Commit Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
