import React from 'react';
import { getExpertByIdServer } from '@/services/directoryServiceServer';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import ExpertHeader from '@/components/expert/ExpertHeader';
import ExpertServicesList from '@/components/expert/ExpertServicesList';
import ExpertContactCard from '@/components/expert/ExpertContactCard';

export default async function ExpertDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params object before accessing properties
  const { id } = await params;
  const expert = await getExpertByIdServer(id);

  if (!expert) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/directory" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Directory
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <ExpertHeader 
            name={expert.name} 
            type={expert.type} 
            specialty={expert.specialty} 
            rating={expert.rating} 
            verified={expert.verified} 
          />

          {/* Content */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
                <p className="text-slate-600 leading-relaxed">
                  {expert.name} is a leading specialist in {expert.specialty} with over 15 years of experience. 
                  Dedicated to providing comprehensive care that integrates modern medical practices with patient-centered approaches.
                </p>
              </section>

              <ExpertServicesList />
            </div>

            <div className="space-y-6">
              <ExpertContactCard 
                location={expert.location} 
                expertId={expert.id} 
                expertName={expert.name} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
