'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { isExpertRole } from '@/types';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Skip check if we're already on onboarding or auth pages
        if (pathname.includes('/onboarding') || pathname.includes('/auth')) {
          setChecking(false);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists()) {
            router.push('/onboarding');
            return;
          }

          const userData = userDoc.data();
          
          // General onboarding check
          if (userData?.onboardingComplete !== true) {
            router.push('/onboarding');
            return;
          }

          // Expert-specific profile completion check
          if (isExpertRole(userData?.role) && userData?.profileComplete !== true) {
            if (!pathname.includes('/expert/setup')) {
              router.push('/expert/setup');
              return;
            }
          }
        } catch (err) {
          console.error("AuthCheck Error:", err);
        }
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // While checking auth status and onboarding, we can show a loader
  // or return null to prevent content flash.
  if (checking && !pathname.includes('/onboarding') && !pathname.includes('/auth')) {
    // If not mounted yet, we return a shell that matches server output
    // to avoid hydration mismatch.
    if (!mounted) return null;

    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900" suppressHydrationWarning>
        <div className="flex flex-col items-center gap-4" suppressHydrationWarning>
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" suppressHydrationWarning></div>
          <p className="text-slate-500 animate-pulse">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
