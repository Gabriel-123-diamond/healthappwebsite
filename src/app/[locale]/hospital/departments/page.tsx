'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Building2, Plus, ArrowLeft, Loader2,
  Activity, Heart, Eye, 
  Zap, Brain, Pill, Baby, Microscope
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { institutionService, getInstitutionById } from '@/services/institutionService';
import { Institution, InstitutionStaff } from '@/types/institution';
import { AddDepartmentForm } from '@/components/institution/departments/AddDepartmentForm';
import { DepartmentCard } from '@/components/institution/departments/DepartmentCard';
import { InstitutionalStats } from '@/components/institution/departments/InstitutionalStats';

const DEPT_ICONS = [
  { id: 'activity', icon: Activity, label: 'General' },
  { id: 'heart', icon: Heart, label: 'Cardiology' },
  { id: 'brain', icon: Brain, label: 'Neurology' },
  { id: 'eye', icon: Eye, label: 'Ophthalmology' },
  { id: 'baby', icon: Baby, label: 'Pediatrics' },
  { id: 'pill', icon: Pill, label: 'Pharmacy' },
  { id: 'microscope', icon: Microscope, label: 'Laboratory' },
  { id: 'zap', icon: Zap, label: 'Emergency' },
];

const DEPT_COLORS = [
  { id: 'blue', color: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-500/20' },
  { id: 'rose', color: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-500/20' },
  { id: 'emerald', color: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-500/20' },
  { id: 'amber', color: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-500/20' },
  { id: 'indigo', color: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-500/20' },
  { id: 'violet', color: 'bg-violet-600', text: 'text-violet-600', border: 'border-violet-500/20' },
];

export default function HospitalDepartmentsPage() {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [staff, setStaff] = useState<InstitutionStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');
  const [deptHead, setDeptHead] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('activity');
  const [selectedColor, setSelectedColor] = useState('blue');

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const [inst, staffData] = await Promise.all([
          getInstitutionById(user.uid),
          institutionService.getStaff(user.uid)
        ]);
        if (inst) setInstitution(inst);
        setStaff(staffData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution || !deptName.trim()) return;

    setSaving(true);
    try {
      const newDept = {
        id: Date.now().toString(),
        name: deptName.trim(),
        description: deptDesc.trim(),
        headExpertId: deptHead || undefined,
        icon: selectedIcon,
        color: selectedColor
      };

      const updatedDepts = [...(institution.departments || []), newDept];
      await institutionService.updateDepartments(institution.id, updatedDepts);
      
      setInstitution({ ...institution, departments: updatedDepts });
      setShowAddForm(false);
      setDeptName('');
      setDeptDesc('');
      setDeptHead('');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const removeDept = async (id: string) => {
    if (!institution) return;
    try {
      const updatedDepts = institution.departments.filter(d => d.id !== id);
      await institutionService.updateDepartments(institution.id, updatedDepts);
      setInstitution({ ...institution, departments: updatedDepts });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <header className="mb-12 space-y-4">
          <Link href="/expert/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2">
            <ArrowLeft size={12} /> Institutional Console
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Building2 size={24} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Department <span className="text-indigo-600">Nodes.</span>
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
            Categorize your clinical services and link specialists to specific institutional departments.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Active Departments</h3>
              {!showAddForm && (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Plus size={14} /> Add Department
                </button>
              )}
            </div>

            <AnimatePresence>
              {showAddForm && (
                <AddDepartmentForm 
                  deptName={deptName} setDeptName={setDeptName}
                  deptDesc={deptDesc} setDeptDesc={setDeptDesc}
                  deptHead={deptHead} setDeptHead={setDeptHead}
                  selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon}
                  selectedColor={selectedColor} setSelectedColor={setSelectedColor}
                  staff={staff} icons={DEPT_ICONS} colors={DEPT_COLORS}
                  saving={saving} onAdd={handleAddDept} onCancel={() => setShowAddForm(false)}
                />
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {institution?.departments?.map((dept) => (
                <DepartmentCard 
                  key={dept.id}
                  dept={dept}
                  iconObj={DEPT_ICONS.find(i => i.id === dept.icon) || DEPT_ICONS[0]}
                  colorObj={DEPT_COLORS.find(c => c.id === dept.color) || DEPT_COLORS[0]}
                  staffCount={staff.filter(s => s.departmentId === dept.id).length}
                  headStaff={staff.find(s => s.uid === dept.headExpertId)}
                  onRemove={removeDept}
                />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <InstitutionalStats 
              staffCount={staff.length}
              deptCount={institution?.departments?.length || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
