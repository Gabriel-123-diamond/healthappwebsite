import { auth } from '@/lib/firebase';

export async function exportData() {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const token = await user.getIdToken();
  
  const response = await fetch('/api/user/export', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to export data');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'health_data_export.json';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function deleteAccount() {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const token = await user.getIdToken();

  const response = await fetch('/api/user/delete', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete account');
  }
}
