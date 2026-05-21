import React from 'react';
import { User, ShieldCheck, Activity, Trash2, Users } from 'lucide-react';
import { InstitutionStaff, Institution } from '@/types/institution';

interface StaffTableProps {
  staff: InstitutionStaff[];
  institution: Institution | null;
  onUnlink: (uid: string) => void;
}

export const StaffTable: React.FC<StaffTableProps> = ({ staff, institution, onUnlink }) => {
  if (staff.length === 0) {
    return (
      <div className="py-24 text-center px-6">
        <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[32px] flex items-center justify-center mb-6 border border-slate-100 dark:border-white/5 shadow-inner mx-auto">
          <Users size={32} className="text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">No Staff Detected</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto text-sm leading-relaxed">
          No nodes matching your current query parameters are linked to this facility.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Practitioner</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Role / Node</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Department</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-sm font-medium text-slate-600 dark:text-slate-300">
          {staff.map((s) => (
            <tr key={s.uid} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
              <td className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.fullName}</p>
                    <p className="text-xs text-slate-400">{s.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-6">
                <div className="flex items-center gap-2">
                  {s.role === 'admin' ? <ShieldCheck size={14} className="text-emerald-500" /> : <Activity size={14} className="text-blue-500" />}
                  <span className="uppercase tracking-widest text-[10px] font-black">{s.role}</span>
                </div>
              </td>
              <td className="p-6">
                <span className="uppercase tracking-widest text-[10px] font-black text-slate-400">
                  {institution?.departments.find(d => d.id === s.departmentId)?.name || 'General Wing'}
                </span>
              </td>
              <td className="p-6 text-right">
                <button 
                  onClick={() => onUnlink(s.uid)}
                  className="p-3 rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
