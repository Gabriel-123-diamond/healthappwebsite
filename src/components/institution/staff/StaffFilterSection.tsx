import React from 'react';
import { motion } from 'framer-motion';
import { Dropdown } from '@/components/ui/Dropdown';

interface StaffFilterSectionProps {
  roleFilter: string;
  setRoleFilter: (val: string) => void;
  deptFilter: string;
  setDeptFilter: (val: string) => void;
  roleOptions: any[];
  deptOptions: any[];
}

export const StaffFilterSection: React.FC<StaffFilterSectionProps> = ({
  roleFilter, setRoleFilter,
  deptFilter, setDeptFilter,
  roleOptions, deptOptions
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      className="mb-8 relative z-50"
    >
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Filter Role</label>
          <Dropdown 
            value={roleFilter}
            onChange={setRoleFilter}
            options={[{ value: 'all', label: 'All Roles' }, ...roleOptions]}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Filter Department</label>
          <Dropdown 
            value={deptFilter}
            onChange={setDeptFilter}
            options={[{ value: 'all', label: 'All Departments' }, ...deptOptions.filter(o => o.value !== 'all')]}
          />
        </div>
      </div>
    </motion.div>
  );
};
