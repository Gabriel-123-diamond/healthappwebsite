import { useState } from 'react';
import { userService } from '@/services/userService';

export function useAdminCreation(showAlert: (title: string, msg: string, type: any) => void, onCreated: () => void) {
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminName, setAdminName] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

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
        onCreated();
      } else {
        showAlert('Creation Failed', data.error || 'Failed to create admin.', 'warning');
      }
    } catch (err) {
      showAlert('Error', 'An error occurred while creating admin.', 'warning');
    } finally {
      setCreatingAdmin(false);
    }
  };

  return {
    showAddAdmin, setShowAddAdmin,
    adminEmail, setAdminEmail,
    adminPass, setAdminPass,
    adminName, setAdminName,
    creatingAdmin,
    handleCreateAdmin
  };
}
