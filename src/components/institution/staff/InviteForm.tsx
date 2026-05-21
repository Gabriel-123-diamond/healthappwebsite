import React from 'react';
import { Mail, UserPlus, Loader2 } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';
import { InstitutionStaffRole } from '@/types/institution';

interface InviteFormProps {
  email: string;
  setEmail: (val: string) => void;
  selectedRole: InstitutionStaffRole;
  setSelectedRole: (val: InstitutionStaffRole) => void;
  selectedDept: string;
  setSelectedDept: (val: string) => void;
  roleOptions: any[];
  deptOptions: any[];
  inviting: boolean;
  onInvite: (e: React.FormEvent) => void;
}

export const InviteForm: React.FC<InviteFormProps> = ({
  email, setEmail,
  selectedRole, setSelectedRole,
  selectedDept, setSelectedDept,
  roleOptions, deptOptions,
  inviting, onInvite
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-xl shadow-blue-900/5 sticky top-24">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-8 leading-relaxed uppercase tracking-widest">
        Invite a verified specialist to link their node to this facility protocol.
      </p>
      <form onSubmit={onInvite} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Staff Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="email"
              required
              placeholder="node@intelligence.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assigned Role</label>
          <Dropdown 
            value={selectedRole}
            onChange={(val) => setSelectedRole(val as InstitutionStaffRole)}
            options={roleOptions}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Department Wing</label>
          <Dropdown 
            value={selectedDept}
            onChange={setSelectedDept}
            options={deptOptions}
          />
        </div>

        <button 
          disabled={inviting}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
        >
          {inviting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
          Dispatch Authorization
        </button>
      </form>
    </div>
  );
};
