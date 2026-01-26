'use client';

import React, { useState } from 'react';
import { Code2, Key, Book, Shield, Zap, Send, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { countries, Country } from '@/lib/countries';

export default function DeveloperPortalPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries.find(c => c.name === 'united_states') || countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 gap-4 h-full transform -skew-y-12 scale-150">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="h-20 border border-white/20 rounded-lg" />
            ))}
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-8"
          >
            <Code2 className="w-4 h-4" />
            Developer Beta
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Build with the <span className="text-blue-500">HealthAI API</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Integrate verified health information and cultural context into your own applications with our robust, evidence-based API.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50">
              Read Documentation
            </button>
            <a href="#request" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all border border-white/10 backdrop-blur-sm">
              Request Access
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <DevFeatureCard 
            icon={<Zap className="w-6 h-6 text-amber-500" />}
            title="Evidence-as-a-Service"
            description="Access our database of peer-reviewed medical journals and traditional herbal knowledge via RESTful endpoints."
          />
          <DevFeatureCard 
            icon={<Shield className="w-6 h-6 text-emerald-500" />}
            title="Privacy First"
            description="Our API is built with HIPAA and GDPR compliance in mind, ensuring secure data exchange for health platforms."
          />
          <DevFeatureCard 
            icon={<Book className="w-6 h-6 text-blue-500" />}
            title="Multilingual Support"
            description="Query results in English, Spanish, and French with automatic localization of medical terminology."
          />
        </div>
      </div>

      {/* Request Form Section */}
      <div id="request" className="max-w-3xl mx-auto px-4 pb-24">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-12">
            {!submitted ? (
              <>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Request an API Key</h2>
                  <p className="text-slate-500">Tell us about your project and we'll get back to you with access credentials.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Work Email</label>
                      <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="john@company.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Organization</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="University, NGO, or Tech Co" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                      <div className="flex gap-2">
                        <div className="relative w-1/3">
                          <select
                            value={selectedCountry.name}
                            onChange={(e) => {
                              const c = countries.find(c => c.name === e.target.value);
                              if (c) setSelectedCountry(c);
                            }}
                            className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          >
                            {countries.map((country) => (
                              <option key={country.name} value={country.name}>
                                {country.flag} {country.code}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                          </div>
                        </div>
                        <input
                          required
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-2/3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="555-0123"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Use Case</label>
                    <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Describe how you plan to use the HealthAI API..." />
                  </div>
                  
                  <button 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Request
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Sent!</h2>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                  Thank you for your interest. Our developer relations team will review your application and contact you within 3-5 business days.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Back to Portal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DevFeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
