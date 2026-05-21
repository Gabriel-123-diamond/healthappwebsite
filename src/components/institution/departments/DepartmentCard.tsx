import React from 'react';
import { Trash2, Users, User } from 'lucide-react';
import { InstitutionStaff } from '@/types/institution';

interface DepartmentCardProps {
  dept: any;
  iconObj: any;
  colorObj: any;
  staffCount: number;
  headStaff: InstitutionStaff | undefined;
  onRemove: (id: string) => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  dept, iconObj, colorObj, staffCount, headStaff, onRemove
}) => {
  return (
    <div className={`bg-white dark:bg-slate-900 p-8 rounded-[40px] border ${colorObj.border} shadow-sm group hover:shadow-xl transition-all relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-[20px] bg-slate-50 dark:bg-white/5 ${colorObj.text}`}>
          <iconObj.icon size={24} />
        </div>
        <button 
          onClick={() => onRemove(dept.id)}
          className="p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{dept.name}</h4>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed line-clamp-2">{dept.description || "No protocol description provided."}</p>
      
      <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{staffCount} Active Nodes</span>
        </div>
        {dept.headExpertId && (
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <User size={10} className="text-slate-400" />
             </div>
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                {headStaff?.fullName.split(' ')[0] || "Head"}
             </span>
          </div>
        )}
      </div>
    </div>
  );
};
