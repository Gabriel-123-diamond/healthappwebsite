'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Loader2, Activity, ShieldCheck, User, Shield
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { institutionService, getInstitutionById } from '@/services/institutionService';
import { InstitutionStaff, InstitutionStaffRole, Institution } from '@/types/institution';
import NiceModal from '@/components/common/NiceModal';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { StaffTable } from '@/components/institution/staff/StaffTable';
import { InviteForm } from '@/components/institution/staff/InviteForm';
import { InviteList } from '@/components/institution/staff/InviteList';
import { StaffPageHeader } from '@/components/institution/staff/StaffPageHeader';
import { StaffFilterSection } from '@/components/institution/staff/StaffFilterSection';

export default function InstitutionalStaffPage() {
  const [staff, setStaff] = useState<InstitutionStaff[]>([]);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<InstitutionStaffRole>('practitioner');
  const [selectedDept, setSelectedDept] = useState('all');

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const fetchData = async () => {
      try {
        const [staffData, instData] = await Promise.all([
          institutionService.getStaff(user.uid),
          getInstitutionById(user.uid)
        ]);
        
        setStaff(staffData);
        if (instData) setInstitution(instData);

        // Real-time listener for invites
        const q = query(
          collection(db, 'staff_invites'),
          where('institutionId', '==', user.uid),
          where('status', '==', 'pending')
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setInvites(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setInviting(true);
    try {
      await institutionService.inviteStaff(
        auth.currentUser!.uid, 
        institution?.name || "Institutional Node", 
        email, 
        selectedRole, 
        selectedDept === 'all' ? undefined : selectedDept
      );
      setEmail('');
      setModalConfig({
        isOpen: true,
        title: "Protocol Dispatched",
        description: `Authorization invitation sent to ${email} as ${selectedRole}.`,
        type: 'success'
      });
    } catch (error) {
      console.error(error);
    } finally {
      setInviting(false);
    }
  };

  const filteredStaff = useMemo(() => {
    return staff.filter(s => {
      const matchesSearch = !searchQuery || 
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || s.role === roleFilter;
      const matchesDept = deptFilter === 'all' || s.departmentId === deptFilter;
      return matchesSearch && matchesRole && matchesDept;
    });
  }, [staff, searchQuery, roleFilter, deptFilter]);

  const activeFiltersCount = [
    roleFilter !== 'all',
    deptFilter !== 'all'
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const roleOptions = [
    { value: 'practitioner', label: 'Practitioner', icon: <Activity size={12} /> },
    { value: 'head', label: 'Dept Head', icon: <Shield size={12} /> },
    { value: 'receptionist', label: 'Receptionist', icon: <User size={12} /> },
    { value: 'admin', label: 'Facility Admin', icon: <ShieldCheck size={12} /> },
  ];

  const deptOptions = [
    { value: 'all', label: 'No Specific Dept' },
    ...(institution?.departments || []).map(d => ({ value: d.id, label: d.name }))
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <StaffPageHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFiltersCount={activeFiltersCount}
        />

        <AnimatePresence>
          {showFilters && (
            <StaffFilterSection 
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              deptFilter={deptFilter}
              setDeptFilter={setDeptFilter}
              roleOptions={roleOptions}
              deptOptions={deptOptions}
            />
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
              <StaffTable 
                staff={filteredStaff}
                institution={institution}
                onUnlink={(uid) => institutionService.unlinkExpert(uid)}
              />
            </div>
            <InviteList invites={invites} institution={institution} />
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Initialize Invitation</h3>
            <InviteForm 
              email={email}
              setEmail={setEmail}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              selectedDept={selectedDept}
              setSelectedDept={setSelectedDept}
              roleOptions={roleOptions}
              deptOptions={deptOptions}
              inviting={inviting}
              onInvite={handleInvite}
            />
          </div>
        </div>
      </div>

      <NiceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
      />
    </div>
  );
}
