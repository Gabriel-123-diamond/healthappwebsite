import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';

interface ExpertHeaderProps {
  name: string;
  type: string;
  specialty: string;
  rating: number;
  verified: boolean;
}

export default function ExpertHeader({ name, type, specialty, rating, verified }: ExpertHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {type}
            </span>
            {verified && (
              <span className="bg-green-500/90 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
          <p className="text-blue-100 text-lg">{specialty}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
            {rating}
          </div>
          <div className="text-xs text-blue-200">Based on 120+ reviews</div>
        </div>
      </div>
    </div>
  );
}
