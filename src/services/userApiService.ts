import { auth } from '@/lib/firebase';

async function fetchWithAuth(url: string, method: string, body?: any) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Authentication required");

  const token = await currentUser.getIdToken();
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const userApiService = {
  checkAvailability: async (field: string, value: string) => {
    const data = await fetchWithAuth('/api/user/check', 'POST', { field, value });
    return !data.taken;
  },

  submitExpertProfile: async (data: any) => {
    return fetchWithAuth('/api/expert/submit', 'POST', data);
  },

  completeOnboarding: async (formData: any) => {
    return fetchWithAuth('/api/user/onboarding/complete', 'POST', formData);
  },

  upgradeTier: async (tier: string, reference?: string) => {
    return fetchWithAuth('/api/user/upgrade', 'POST', { tier, reference });
  },

  verifyEmail: async (email: string, otp: string) => {
    return fetchWithAuth('/api/user/verify-email', 'POST', { email, otp });
  },

  verifyPhone: async (phone: string) => {
    return fetchWithAuth('/api/user/verify-phone', 'POST', { phone });
  },

  syncVerificationStatus: async () => {
    return fetchWithAuth('/api/user/verify', 'POST');
  },

  getAdmins: async () => {
    const response = await fetch('/api/admin/list');
    if (!response.ok) throw new Error('Failed to fetch admins');
    return await response.json();
  },

  getPendingExperts: async () => {
    const response = await fetch('/api/admin/experts/pending');
    if (!response.ok) throw new Error('Failed to fetch pending experts');
    return await response.json();
  },

  getVerifiedExperts: async () => {
    const response = await fetch('/api/admin/experts/verified');
    if (!response.ok) throw new Error('Failed to fetch verified experts');
    return await response.json();
  },

  getTierUpgrades: async () => {
    const response = await fetch('/api/admin/experts/upgrades');
    if (!response.ok) throw new Error('Failed to fetch tier upgrades');
    return await response.json();
  }
};
