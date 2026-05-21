import React from 'react';
import { motion } from 'framer-motion';
import { InstitutionStaff } from '@/types/institution';

interface AddDepartmentFormProps {
  deptName: string;
  setDeptName: (val: string) => void;
  deptDesc: string;
  setDeptDesc: (val: string) => void;
  deptHead: string;
  setDeptHead: (val: string) => void;
  selectedIcon: string;
  setSelectedIcon: (val: string) => void;
  selectedColor: string;
  setSelectedColor: (val: string) => void;
  staff: InstitutionStaff[];
  icons: any[];
  colors: any[];
  saving: boolean;
  onAdd: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const AddDepartmentForm: React.FC<AddDepartmentFormProps> = ({
  deptName, setDeptName,
  deptDesc, setDeptDesc,
  deptHead, setDeptHead,
  selectedIcon, setSelectedIcon,
  selectedColor, setSelectedColor,
  staff, icons, colors,
  saving, onAdd, onCancel
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-indigo-500/20 shadow-2xl mb-12"
    >
      <form onSubmit={onAdd} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Department Name</label>
            <input 
              required
              value={deptName}
              onChange={e => setDeptName(e.target.value)}
              placeholder="e.g. Cardiology Node"
              className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Department Head</label>
            <select 
              value={deptHead}
              onChange={e => setDeptHead(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none transition-all"
            >
              <option value="">Unassigned</option>
              {staff.map(s => (
                <option key={s.uid} value={s.uid}>{s.fullName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Icon Protocol</label>
          <div className="flex flex-wrap gap-3">
            {icons.map(i => (
              <button
                key={i.id}
                type="button"
                onClick={() => setSelectedIcon(i.id)}
                className={`p-4 rounded-2xl transition-all border-2 ${selectedIcon === i.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-transparent hover:border-indigo-500/20'}`}
              >
                <i.icon size={20} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phase Color</label>
          <div className="flex flex-wrap gap-4">
            {colors.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedColor(c.id)}
                className={`w-10 h-10 rounded-full transition-all ring-offset-4 ring-offset-white dark:ring-offset-slate-900 ${c.color} ${selectedColor === c.id ? 'ring-2 ring-indigo-500' : 'hover:scale-110'}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Protocol Description</label>
          <textarea 
            value={deptDesc}
            onChange={e => setDeptDesc(e.target.value)}
            placeholder="Describe clinical focus..."
            rows={3}
            className="w-full p-6 bg-slate-50 dark:bg-white/5 border-none rounded-3xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit"
            disabled={saving}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? "Deploying Node..." : "Activate Department"}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
          >
            Abort
          </button>
        </div>
      </form>
    </motion.div>
  );
};
