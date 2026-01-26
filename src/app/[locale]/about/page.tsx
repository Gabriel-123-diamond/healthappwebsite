'use client';

import React from 'react';
import { Shield, Users, Heart, Globe, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      {/* Hero */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-950 text-center">
                  <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                      Bridging the gap between <span className="text-blue-600">Nature</span> and <span className="text-blue-600">Science</span>.
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      Ikiké Health AI was founded with a single mission: to bridge the gap between modern clinical medicine and traditional herbal wisdom through explainable AI.
                    </p>
                  </div>      </section>

      {/* Vision & Mission */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Our Vision</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              We envision a world where every individual, regardless of their location or background, has access to reliable, evidence-based health information that respects both scientific rigor and cultural traditions.
            </p>
            <div className="space-y-4">
              <ValueItem icon={<Shield className="w-5 h-5 text-blue-600" />} text="Evidence-based summaries from peer-reviewed sources." />
              <ValueItem icon={<Globe className="w-5 h-5 text-emerald-600" />} text="Culturally sensitive health insights for a global population." />
              <ValueItem icon={<Users className="w-5 h-5 text-purple-600" />} text="A verified network of professionals and institutions." />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-blue-600/5 dark:bg-blue-600/10 rounded-3xl flex items-center justify-center p-12">
              <Heart className="w-full h-full text-blue-600/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-32 h-32 text-blue-600 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 px-4 bg-slate-900 text-white rounded-t-[3rem]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Built on Trust & Safety</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Strict Safety Protocols</h3>
              <p className="text-slate-400 text-sm">Real-time keyword interception for emergency situations and red-flag symptoms.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold">Verified Experts</h3>
              <p className="text-slate-400 text-sm">Human-in-the-loop review system ensuring AI responses meet clinical standards.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Privacy First</h3>
              <p className="text-slate-400 text-sm">Full data ownership with end-to-end encryption for sensitive health logs.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
        {icon}
      </div>
      <p className="text-slate-700 dark:text-slate-300 font-medium">{text}</p>
    </div>
  );
}
