'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthCheckWrapperProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthCheckWrapper({ children, fallback }: AuthCheckWrapperProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
