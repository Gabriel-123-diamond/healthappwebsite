'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { Loader2 } from 'lucide-react';

export default function ExpertRegistrationRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new unified onboarding flow which handles expert roles
    router.push('/onboarding?role=expert');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Redirecting to Expert Onboarding...</p>
    </div>
  );
}
