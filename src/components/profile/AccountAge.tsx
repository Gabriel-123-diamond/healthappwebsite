'use client';

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

export default function AccountAge({ createdAt }: { createdAt: string | undefined | null }) {
  const [age, setAge] = useState<string>('');

  useEffect(() => {
    if (!createdAt) return;

    const calculateAge = () => {
      const start = new Date(createdAt);
      const now = new Date();
      
      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();
      
      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const diffMs = now.getTime() - start.getTime();
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diffMs / (1000 * 60)) % 60);
      const secs = Math.floor((diffMs / 1000) % 60);

      const yearsStr = years + "yrs";
      const monthsStr = months + "mo";
      const daysStr = days + "d";
      const timeStr = String(hours).padStart(2, '0') + ":" + String(mins).padStart(2, '0') + ":" + String(secs).padStart(2, '0');
      
      setAge(yearsStr + " " + monthsStr + " " + daysStr + " " + timeStr);
    };

    calculateAge();
    const interval = setInterval(calculateAge, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  if (!createdAt) return null;

  return (
    <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl w-fit">
      <Zap size={10} className="text-blue-500 animate-pulse" />
      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono">
        {age}
      </span>
    </div>
  );
}
