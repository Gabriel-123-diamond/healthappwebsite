'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isSuper, setIsSuper] = useState<boolean>(false);

  useEffect(() => {
    // This flag is set on successful login. 
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    
    if (isAuthenticated !== 'true') {
      router.push('/admin/login');
      setIsAdmin(false);
      return;
    }

    // Check super admin status from cookie
    const isSuperAdmin = document.cookie.split('; ').find(row => row.startsWith('is_super_admin='))?.split('=')[1] === 'true';
    setIsSuper(isSuperAdmin);
    setIsAdmin(true);
  }, [router]);

  return { isAdmin, isSuper, isLoading: isAdmin === null };
}
