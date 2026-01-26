import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 animate-pulse shadow-xl">
        <span className="text-white font-bold text-5xl">H</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">HealthAI</h1>
      <div className="flex items-center gap-2 text-blue-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="font-medium">Loading Experience...</span>
      </div>
    </div>
  );
}
