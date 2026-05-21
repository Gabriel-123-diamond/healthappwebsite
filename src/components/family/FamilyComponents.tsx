import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, Mail, Shield, ArrowLeft, Loader2, 
  Trash2, Plus, Lock, User, Zap
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { UserProfile } from '@/types/user';
import { FamilyInvite } from '@/services/familyService';

export const FamilyLockedState = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-20">
    <div className="max-w-2xl mx-auto px-4 text-center">
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-[28px] flex items-center justify-center text-blue-600 mx-auto mb-8">
        <Lock size={40} />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
        Family <span className="text-blue-600">Locked.</span>
      </h1>
      <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
        The Family Node is an ELITE clinical protocol. Upgrade to link up to 4 family members under your account, sharing clinical intelligence and vault benefits.
      </p>
      <Link href="/upgrade" className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
        Unlock ELITE Protocol <Zap size={14} />
      </Link>
    </div>
  </div>
);

export const FamilyMemberCard = ({ member, onRemove }: { member: UserProfile, onRemove: (uid: string) => void }) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center gap-4 group">
    <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
      <User size={20} />
    </div>
    <div className="flex-1 overflow-hidden">
      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase truncate">{member.fullName}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{member.email}</p>
    </div>
    <div className="flex items-center gap-2">
      <Link 
        href={`/vault?uid=${member.uid}&name=${encodeURIComponent(member.fullName)}`}
        className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all opacity-0 group-hover:opacity-100"
        title="View Shared Vault"
      >
        <Shield size={16} />
      </Link>
      <button 
        onClick={() => onRemove(member.uid)}
        className="p-2 rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

export const PendingInviteItem = ({ invite }: { invite: FamilyInvite }) => (
  <div className="bg-amber-50/30 dark:bg-amber-900/5 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Mail size={16} className="text-amber-500" />
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{invite.receiverEmail}</span>
    </div>
    <span className="text-[8px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">Awaiting Node</span>
  </div>
);

export const FamilyInviteForm = ({ 
  inviteEmail, 
  setInviteEmail, 
  onInvite, 
  inviting 
}: { 
  inviteEmail: string, 
  setInviteEmail: (val: string) => void, 
  onInvite: (e: React.FormEvent) => void, 
  inviting: boolean 
}) => (
  <div className="space-y-6">
    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Add Member</h3>
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 leading-relaxed uppercase tracking-widest">
        Invite a family member by email. Once they accept, they will gain access to your node's intelligence.
      </p>
      <form onSubmit={onInvite} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="email"
            required
            placeholder="member@email.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
        <button 
          disabled={inviting}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {inviting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
          Authorize Member
        </button>
      </form>
    </div>
  </div>
);
