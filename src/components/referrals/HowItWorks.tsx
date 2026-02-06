'use client';

import React from 'react';

export default function HowItWorks() {
  return (
    <div className="mt-16 pt-12 border-t border-slate-100 text-left">
      <h2 className="text-xl font-black text-slate-900 mb-6 tracking-tight">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-600/20">1</div>
          <p className="text-sm text-slate-600 font-bold leading-relaxed">Generate your unique referral code above.</p>
        </div>
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-600/20">2</div>
          <p className="text-sm text-slate-600 font-bold leading-relaxed">Share it with friends via social media or email.</p>
        </div>
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-600/20">3</div>
          <p className="text-sm text-slate-600 font-bold leading-relaxed">Earn rewards when they complete profile setup.</p>
        </div>
      </div>
    </div>
  );
}
