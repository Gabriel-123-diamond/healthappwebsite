'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, CheckCircle, Stethoscope, Leaf, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ExpertRegistrationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'doctor', // doctor, herbalist, hospital
    specialty: '',
    licenseNumber: '',
    location: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          const city = data.city || data.locality || data.principalSubdivision || '';
          const country = data.countryName || '';
          setFormData(prev => ({ ...prev, location: `${city}${city && country ? ', ' : ''}${country}` }));
        } catch (error) {
          console.error("Reverse geocoding failed", error);
          setFormData(prev => ({ ...prev, location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` }));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
        alert("Permission denied or location unavailable.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app, you'd likely want to upload documents here too.
      // For now, we just create a request record.
      await addDoc(collection(db, 'expert_requests'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting request:", err);
      setError('Failed to submit application. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Received!</h2>
          <p className="text-slate-600 mb-8">
            Thank you for applying to join HealthAI as an expert. Our team will review your credentials and contact you via email within 2-3 business days.
          </p>
          <Link href="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 py-8 px-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Join our Expert Network</h1>
          <p className="text-slate-400">
            Connect with thousands of users seeking trusted health advice.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Expert Type Selection */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${formData.type === 'doctor' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'}`}>
              <input type="radio" name="type" value="doctor" checked={formData.type === 'doctor'} onChange={handleChange} className="sr-only" />
              <Stethoscope className="w-6 h-6" />
              <span className="font-medium text-sm">Doctor</span>
            </label>
            <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${formData.type === 'herbalist' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:bg-slate-50'}`}>
              <input type="radio" name="type" value="herbalist" checked={formData.type === 'herbalist'} onChange={handleChange} className="sr-only" />
              <Leaf className="w-6 h-6" />
              <span className="font-medium text-sm">Herbalist</span>
            </label>
            <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${formData.type === 'hospital' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:bg-slate-50'}`}>
              <input type="radio" name="type" value="hospital" checked={formData.type === 'hospital'} onChange={handleChange} className="sr-only" />
              <Building2 className="w-6 h-6" />
              <span className="font-medium text-sm">Hospital</span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name / Institution Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                placeholder="Dr. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
              <input
                type="text"
                name="specialty"
                required
                value={formData.specialty}
                onChange={handleChange}
                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                placeholder="e.g. Cardiology, Ayurveda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">License / Reg. Number</label>
              <input
                type="text"
                name="licenseNumber"
                required
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                placeholder="License ID"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm font-medium text-slate-700">Location (City, Country)</label>
              <button 
                type="button" 
                onClick={requestLocation}
                className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                Auto-detect
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 pr-12 border"
                placeholder="e.g. New York, USA"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400">
                {isLocating ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <MapPin className="w-5 h-5" />}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Brief Description</label>
            <textarea
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
              placeholder="Tell us about your experience and practice..."
            ></textarea>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
            </button>
          </div>
          
          <p className="text-center text-xs text-slate-500">
            By submitting this form, you agree to our Terms of Service and Privacy Policy.
            We verify all experts before listing them on our platform.
          </p>
        </form>
      </div>
    </div>
  );
}
