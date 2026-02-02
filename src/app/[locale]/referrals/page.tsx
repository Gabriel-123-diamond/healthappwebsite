'use client';

import React, { useState } from 'react';
import { Copy, RefreshCw, Share2 } from 'lucide-react';
import { referralService } from '@/services/referralService';

export default function ReferralsPage() {
  const [code, setCode] = useState<string>('HEALTH25');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const newCode = await referralService.generateReferralCode();
      setCode(newCode);
    } catch (error) {
      console.error('Failed to generate code:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert('Referral code copied!');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Share2 className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Invite & Earn</h1>
          <p className="text-slate-600 mb-10 text-lg">
            Invite your friends to join HealthAI. You'll both earn <span className="font-bold text-blue-600">50 Health Points</span> when they sign up using your code!
          </p>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
            <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-2">Your Unique Referral Code</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-3xl font-mono font-bold text-slate-900 tracking-widest">{code}</span>
              <button 
                onClick={copyToClipboard}
                className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                title="Copy Code"
              >
                <Copy className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center justify-center gap-2 mx-auto text-blue-600 font-bold hover:text-blue-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            Generate New Code
          </button>

          <div className="mt-12 pt-8 border-t border-slate-100 text-left">
            <h2 className="text-lg font-bold text-slate-900 mb-4">How it works</h2>
            <ul className="space-y-4 text-slate-600">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                <p>Generate your unique referral code above.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                <p>Share it with friends and family via social media or email.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                <p>Earn rewards automatically when they complete their profile setup.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
