'use client';

import React from 'react';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default function ReferralLoggedOutCTA() {
  return (
    <div className="bg-white rounded-3xl sm:rounded-[40px] shadow-2xl p-6 sm:p-12 border border-slate-100 text-center max-w-2xl mx-auto">
      <div className="p-4 sm:p-6 bg-blue-50 text-blue-600 rounded-2xl sm:rounded-[32px] w-fit mx-auto mb-6 sm:mb-8 shadow-inner">
        <LogIn size={32} className="sm:w-12 sm:h-12" strokeWidth={2.5} />
      </div>
      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight">Join the Referral Program</h2>
      <p className="text-slate-500 font-medium mb-8 sm:mb-10 text-sm sm:text-lg leading-relaxed">Sign in or create an account to get your unique referral code, start earning Health Points, and track your successful invites.</p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <Link href="/auth/signin" className="px-8 sm:px-12 py-4 sm:py-5 bg-slate-900 text-white rounded-xl sm:rounded-[24px] font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 text-center text-sm sm:text-base">
          Sign In
        </Link>
        <Link href="/auth/signup" className="px-8 sm:px-12 py-4 sm:py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-xl sm:rounded-[24px] font-black hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95 text-center text-sm sm:text-base">
          Create Account
        </Link>
      </div>
    </div>
  );
}
