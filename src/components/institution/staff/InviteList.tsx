import React from 'react';
import { Mail } from 'lucide-react';
import { Institution } from '@/types/institution';

interface InviteListProps {
  invites: any[];
  institution: Institution | null;
}

export const InviteList: React.FC<InviteListProps> = ({ invites, institution }) => {
  if (invites.length === 0) return null;

  return (
    <div className="pt-12 space-y-6">
      <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest">Pending Protocol Authorizations</h3>
      <div className="space-y-3">
        {invites.map((invite) => (
          <div key={invite.id} className="bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-amber-100 dark:border-amber-900/20 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-500">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{invite.email}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {invite.role} · {institution?.departments.find(d => d.id === invite.departmentId)?.name || 'General'}
                </p>
              </div>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-full border border-amber-100 dark:border-amber-900/20">
              Awaiting Handshake
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
