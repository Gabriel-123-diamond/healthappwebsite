import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { userService } from '@/services/userService';
import { UserProfile } from '@/types';

export function useAdminDashboard() {
  const router = useRouter();
  const { isLoading, isSuper } = useAdminAuth();
  const [experts, setExperts] = useState<UserProfile[]>([]);
  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<UserProfile | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState<'verifications' | 'admins'>('verifications');
  
  // Create Admin Form State
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminName, setAdminName] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

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

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type
    });
  };

  const showConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirmConfig({
      isOpen: true,
      title,
      description,
      onConfirm
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expertsData, adminsData] = await Promise.all([
          userService.getPendingExperts(),
          isSuper ? userService.getAdmins() : Promise.resolve([])
        ]);
        setExperts(expertsData);
        setAdmins(adminsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!isLoading) fetchData();
  }, [isLoading, isSuper]);

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch('/api/admin/expert/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId: id, status: 'verified' }),
      });
      if (!res.ok) throw new Error('Failed to verify');
      setExperts(prev => prev.filter(e => e.uid !== id));
      setSelectedExpert(null);
      showAlert('Expert Verified', 'Expert application has been successfully verified.', 'success');
    } catch (err) {
      showAlert('Verification Failed', 'Failed to verify expert application.', 'warning');
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      const res = await fetch('/api/admin/expert/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId: id, status: 'rejected', notes: reason }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      setExperts(prev => prev.filter(e => e.uid !== id));
      setSelectedExpert(null);
      showAlert('Application Rejected', 'Expert application has been rejected.', 'info');
    } catch (err) {
      showAlert('Rejection Failed', 'Failed to reject application.', 'warning');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAdmin(true);
    try {
      const res = await fetch('/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPass, fullName: adminName }),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert('Admin Created', data.message || 'New admin has been created.', 'success');
        setShowAddAdmin(false);
        setAdminEmail('');
        setAdminPass('');
        setAdminName('');
        // Refresh admins
        const adminsData = await userService.getAdmins();
        setAdmins(adminsData);
      } else {
        showAlert('Creation Failed', data.error || 'Failed to create admin.', 'warning');
      }
    } catch (err) {
      showAlert('Error', 'An error occurred while creating admin.', 'warning');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    document.cookie = 'is_super_admin=; Max-Age=0; path=/';
    router.push('/');
  };

  const handleSeed = async () => {
    showConfirm(
      'System Seeding',
      'This will inject sample data into the production environment. Are you sure you wish to proceed?',
      async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setSeeding(true);
        try {
          const res = await fetch('/api/admin/seed', { method: 'POST' });
          if (res.ok) showAlert('Success', 'Database seeded successfully!', 'success');
          else showAlert('Error', 'Failed to seed database.', 'warning');
        } catch (err) {
          showAlert('Error', 'An error occurred while seeding database.', 'warning');
        } finally {
          setSeeding(false);
        }
      }
    );
  };

  return {
    isLoading,
    isSuper,
    experts,
    admins,
    loading,
    selectedExpert,
    setSelectedExpert,
    seeding,
    activeTab,
    setActiveTab,
    showAddAdmin,
    setShowAddAdmin,
    adminEmail,
    setAdminEmail,
    adminPass,
    setAdminPass,
    adminName,
    setAdminName,
    creatingAdmin,
    modalConfig,
    setModalConfig,
    confirmConfig,
    setConfirmConfig,
    handleVerify,
    handleReject,
    handleCreateAdmin,
    handleLogout,
    handleSeed,
  };
}
