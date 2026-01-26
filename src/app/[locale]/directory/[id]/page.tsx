import React from 'react';
import { getExpertById } from '@/services/directoryService';
import { notFound } from 'next/navigation';
import { MapPin, Star, Phone, Clock, Globe, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default async function ExpertDetailsPage({ params }: { params: { id: string } }) {
  // Await params object before accessing properties
  const { id } = await Promise.resolve(params);
  const expert = await getExpertById(id);

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
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {expert.type}
                  </span>
                  {expert.verified && (
                    <span className="bg-green-500/90 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{expert.name}</h1>
                <p className="text-blue-100 text-lg">{expert.specialty}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-2xl font-bold">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  {expert.rating}
                </div>
                <div className="text-xs text-blue-200">Based on 120+ reviews</div>
              </div>
            </div>
          </div>

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

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Services</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Consultation', 'Diagnostic Imaging', 'Preventive Care', 'Follow-up Treatment'].map((service, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      {service}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900">Address</div>
                      <div className="text-sm text-slate-500">{expert.location}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900">Phone</div>
                      <div className="text-sm text-slate-500">+1 (555) 123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900">Website</div>
                      <div className="text-sm text-slate-500 text-blue-600 hover:underline cursor-pointer">Visit Website</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900">Hours</div>
                      <div className="text-sm text-slate-500">Mon-Fri: 9am - 5pm</div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
