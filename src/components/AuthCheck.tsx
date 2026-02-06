'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Skip check if we're already on onboarding or auth pages
        if (pathname.includes('/onboarding') || pathname.includes('/auth')) {
          setChecking(false);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists() || userDoc.data()?.onboardingComplete !== true) {
            router.push('/onboarding');
            return;
          }
        } catch (err) {
          console.error("AuthCheck Error:", err);
        }
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // We still show children but the useEffect will handle redirection if needed.
  // Using a full "blocking" loader might be too aggressive for public pages.
  return <>{children}</>;
}
