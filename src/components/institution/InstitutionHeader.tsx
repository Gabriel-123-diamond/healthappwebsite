'use client';

import React from 'react';
import { Building2, CheckCircle, Globe, MapPin, UserPlus } from 'lucide-react';
import { Institution } from '@/services/institutionService';

interface InstitutionHeaderProps {
  institution: Institution;
}

export default function InstitutionHeader({ institution }: InstitutionHeaderProps) {
  return (
    <div className="h-64 bg-slate-900 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-6 w-full">
          <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center -mb-12 border-4 border-white">
            <Building2 className="w-16 h-16 text-slate-300" />
          </div>
          
          <div className="flex-1 text-white mb-2">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{institution.name}</h1>
              {institution.verified && (
                <CheckCircle className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <div className="flex items-center gap-4 text-slate-300 text-sm">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{institution.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{institution.location}</span>
              </div>
              {institution.website && (
                <a href={institution.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 mb-2 shadow-lg shadow-blue-900/50">
            <UserPlus className="w-5 h-5" />
            Follow Institution
          </button>
        </div>
      </div>
    </div>
  );
}
