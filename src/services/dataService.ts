import { auth } from '@/lib/firebase';
import { generateHealthReportPdf } from './pdfExportService';

export async function fetchExportData() {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const token = await user.getIdToken();
  
  const response = await fetch('/api/user/export', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to export data');
  }

  return response.json();
}

export async function exportDataAsJson() {
  const data = await fetchExportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `health_data_export_${auth.currentUser?.uid || 'node'}.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function exportDataAsPdf() {
  const data = await fetchExportData();
  generateHealthReportPdf(data);
}

export async function exportData() {
  await exportDataAsJson();
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
