'use client';

import React from 'react';
import { Copy, RefreshCw, Link as LinkIcon, Share2 } from 'lucide-react';

interface ReferralCodeCardProps {
  code: string;
  generating: boolean;
  onGenerate: () => void;
  onCopy: () => void;
  onCopyLink: () => void;
  onShare: () => void;
}

export default function ReferralCodeCard({ code, generating, onGenerate, onCopy, onCopyLink, onShare }: ReferralCodeCardProps) {
  const isSpecialState = code === 'LOADING...' || code === 'NO CODE' || code === 'LOGIN REQUIRED' || code === 'ERROR' || code === '...';

  return (
    <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-200/60 mb-8 max-w-md mx-auto">
      <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-4">Your Unique Referral Code</p>
      <div className="flex items-center justify-center gap-6">
        <span className="text-4xl font-mono font-black text-slate-900 tracking-widest">
          {code}
        </span>
        {!isSpecialState && (
          <button 
            onClick={onCopy}
            className="p-3 bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all border border-slate-200 hover:border-blue-200 shadow-sm"
            title="Copy Code Only"
          >
            <Copy className="w-6 h-6" />
          </button>
        )}
      </div>

      {!isSpecialState && (
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onCopyLink}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
          >
            <LinkIcon className="w-4 h-4" />
            Copy Link
          </button>
          <button
            onClick={onShare}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 border border-transparent rounded-2xl text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Share2 className="w-4 h-4" />
            Share Now
          </button>
        </div>
      )}
      
      {(code === 'NO CODE' || code === '...') && (
        <button
          onClick={onGenerate}
          disabled={generating}
          className="mt-6 flex items-center justify-center gap-3 mx-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50 w-full"
        >
          <RefreshCw className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Get My Referral Code'}
        </button>
      )}
    </div>
  );
}