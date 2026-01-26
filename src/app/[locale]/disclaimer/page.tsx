import React from 'react';
import { ShieldAlert, Search, Leaf, Siren, Stethoscope } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4 dark:text-white">Legal Disclaimers</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Please read these disclaimers carefully. They govern the use of specific features and information within the IKIKE platform.
          </p>
        </div>

        {/* Global Disclaimer */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div className="bg-amber-500 p-4 flex items-center gap-3 text-white">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-xl font-bold">Global Disclaimer</h2>
          </div>
          <div className="p-6 text-slate-700 dark:text-slate-300">
            <p>
              IKIKE provides health information for educational purposes only. It does not diagnose, treat, or replace professional medical advice. Always consult a qualified healthcare professional.
            </p>
          </div>
        </div>

        {/* Search Results Disclaimer */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div className="bg-blue-500 p-4 flex items-center gap-3 text-white">
            <Search className="w-6 h-6" />
            <h2 className="text-xl font-bold">Search Results Disclaimer</h2>
          </div>
          <div className="p-6 text-slate-700 dark:text-slate-300">
            <p>
              Content shown is educational and sourced from public platforms. IKIKE does not provide medical or herbal treatment advice.
            </p>
          </div>
        </div>

        {/* Herbal Information Disclaimer */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div className="bg-green-600 p-4 flex items-center gap-3 text-white">
            <Leaf className="w-6 h-6" />
            <h2 className="text-xl font-bold">Herbal Information Disclaimer</h2>
          </div>
          <div className="p-6 text-slate-700 dark:text-slate-300">
            <p>
              Herbal and traditional information is for educational and cultural awareness only. IKIKE does not recommend herbs as treatments or provide preparation or dosage instructions.
            </p>
          </div>
        </div>

        {/* Emergency Disclaimer */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div className="bg-red-600 p-4 flex items-center gap-3 text-white">
            <Siren className="w-6 h-6" />
            <h2 className="text-xl font-bold">Emergency Disclaimer</h2>
          </div>
          <div className="p-6 text-slate-700 dark:text-slate-300">
            <p>
              Some symptoms may require urgent medical attention. Seek immediate care from a qualified healthcare provider or emergency service.
            </p>
          </div>
        </div>

        {/* Expert & Hospital Listings Disclaimer */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div className="bg-indigo-600 p-4 flex items-center gap-3 text-white">
            <Stethoscope className="w-6 h-6" />
            <h2 className="text-xl font-bold">Expert & Hospital Listings Disclaimer</h2>
          </div>
          <div className="p-6 text-slate-700 dark:text-slate-300">
            <p>
              Listings are for informational purposes only. IKIKE does not guarantee the quality of services provided.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
