'use client';

import React, { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { getExpertById } from '@/services/directoryService';
import { PublicExpert } from '@/types/expert';
import { Link } from '@/i18n/routing';
import ExpertHeader from '@/components/expert/ExpertHeader';
import ExpertContactCard from '@/components/expert/ExpertContactCard';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { RestrictedPage } from '@/components/common/RestrictedPage';
import HospitalProfileView from '@/components/hospital/HospitalProfileView';
import ExpertProfileView from '@/components/expert/ExpertProfileView';
import PractitionerProfileView from '@/components/expert/PractitionerProfileView';

export default function ExpertDetailsPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useUserAuth();
  const [expert, setExpert] = useState<PublicExpert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === 'string') {
      getExpertById(id).then(data => {
        setExpert(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (authLoading || (loading && !expert)) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 pt-32 sm:pt-40">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (!user) return (
    <RestrictedPage 
      title="Specialist Profile Restricted"
      description="Detailed clinical profiles, verified credentials, and appointment booking are reserved for authenticated network members."
    />
  );

  if (!expert && !loading) {
    notFound();
  }

  if (!expert) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-10 flex items-center justify-between">
          <Link href="/directory" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Registry Directory
          </Link>

          {user.uid === id && (
            <Link href="/expert/setup" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-200 dark:shadow-none">
              Edit My Public Identity
            </Link>
          )}
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-3xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
          <ExpertHeader 
            name={expert.name} 
            type={expert.type} 
            specialty={expert.specialty} 
            rating={expert.rating} 
            verified={expert.verificationStatus === 'verified'} 
            imageUrl={expert.imageUrl}
          />

          {/* Content */}
          <div className="p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
            <div className="lg:col-span-7">
              {expert.type === 'hospital' ? (
                <HospitalProfileView hospital={expert} />
              ) : expert.type === 'wellness_practitioner' ? (
                <PractitionerProfileView practitioner={expert} />
              ) : (
                <ExpertProfileView expert={expert} />
              )}
            </div>

            {/* Sidebar Contact */}
            <div className="lg:col-span-5">
              <div className="sticky top-32">
                <ExpertContactCard 
                  location={expert.location} 
                  expertId={expert.id} 
                  expertName={expert.name} 
                  email={expert.email}
                  phone={expert.phone}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
