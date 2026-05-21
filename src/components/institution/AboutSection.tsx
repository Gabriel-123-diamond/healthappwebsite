'use client';

import React from 'react';
import { Institution } from '@/types/institution';

interface AboutSectionProps {
  institution: Institution;
}

export default function AboutSection({ institution }: AboutSectionProps) {
  return (
    <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
      <p className="text-slate-600 leading-relaxed text-lg">
        {institution.description}
      </p>
      
      <div className="mt-6 flex flex-wrap gap-2">
        {institution.specialties.map(spec => (
          <span key={spec} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
            {spec}
          </span>
        ))}
      </div>
    </section>
  );
}
