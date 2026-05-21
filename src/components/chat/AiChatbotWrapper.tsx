'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AiChatbot = dynamic(() => import('./AiChatbot'), { ssr: false });

export default function AiChatbotWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || !isAuthenticated) return null;

  return <AiChatbot />;
}
