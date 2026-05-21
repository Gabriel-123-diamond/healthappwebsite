import { useState, useEffect, useCallback } from 'react';
import { useRouter } from '@/i18n/routing';

export function useAdminAuth() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isSuper, setIsSuper] = useState<boolean>(false);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      setIsAdmin(false);
      setIsSuper(false);
      router.push('/admin/login');
      return;
    }

    const isSuperAdmin = document.cookie.split('; ').find(row => row.startsWith('is_super_admin='))?.split('=')[1] === 'true';
    
    setIsSuper(isSuperAdmin);
    setIsAdmin(true);
  }, [router]);

  return { 
    isAdmin, 
    isSuper, 
    isLoading: isAdmin === null
  };
}
