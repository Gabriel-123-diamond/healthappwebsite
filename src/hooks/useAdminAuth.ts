'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // This flag is set on successful login. 
    // The actual security is the httpOnly 'admin_session' cookie.
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    
    if (isAuthenticated !== 'true') {
      router.push('/admin/login');
      setIsAdmin(false);
      return;
    }

    setIsAdmin(true);
  }, [router]);

  return { isAdmin, isLoading: isAdmin === null };
}
