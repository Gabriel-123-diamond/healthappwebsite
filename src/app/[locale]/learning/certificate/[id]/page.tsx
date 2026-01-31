'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getLearningPathById, LearningPath } from '@/services/learningService';
import { auth } from '@/lib/firebase';
import { Award, Printer, Download, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CertificatePage() {
  const { id } = useParams();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof id === 'string') {
      getLearningPathById(id).then(data => setPath(data || null));
    }
    const unsubscribe = auth.onAuthStateChanged(u => setUser(u));
    return () => unsubscribe();
  }, [id]);

  if (!path) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden">
        <Link href={`/learning/${id}`} className="flex items-center text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Course
        </Link>
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print Certificate
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white border-[16px] border-slate-900 p-12 relative shadow-2xl overflow-hidden print:shadow-none print:border-[12px]">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-32 -mb-32 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 text-center space-y-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <span className="text-4xl font-bold">H</span>
            </div>
          </div>
          
          <h1 className="text-sm font-bold tracking-[0.3em] text-blue-600 uppercase">Certificate of Completion</h1>
          
          <div className="space-y-4">
            <p className="text-slate-500 font-serif italic text-xl">This is to certify that</p>
            <h2 className="text-5xl font-extrabold text-slate-900 border-b-2 border-slate-100 inline-block px-12 pb-2">
              {user?.displayName || user?.email?.split('@')[0] || 'HealthAI Learner'}
            </h2>
          </div>

          <div className="max-w-xl mx-auto space-y-4">
            <p className="text-slate-600 text-lg leading-relaxed">
              has successfully completed the continuing education module:
            </p>
            <h3 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
              {path.title}
            </h3>
            <p className="text-slate-500 text-sm">
              An evidence-based learning path verified by HealthAI professionals.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 items-end">
            <div className="text-center space-y-2">
              <div className="h-0.5 bg-slate-200 w-full mb-4" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date Issued</p>
              <p className="font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="flex justify-center flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-amber-400 flex items-center justify-center relative bg-amber-50 shadow-inner">
                <Award className="w-12 h-12 text-amber-500" />
                <ShieldCheck className="w-6 h-6 text-blue-600 absolute -bottom-1 -right-1" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-tighter">Verified Badge</p>
            </div>

            <div className="text-center space-y-2">
              <div className="h-0.5 bg-slate-200 w-full mb-4" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Certificate ID</p>
              <p className="font-mono text-xs text-slate-900">HAI-C-{id?.toString().slice(0,8).toUpperCase()}-{Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>
          </div>

          <div className="pt-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
              Accredited Content Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
