'use client';

import React from 'react';
import { Shield, Check } from 'lucide-react';
import CustomSelect from '@/components/common/CustomSelect';

export default function AutoLogoutSelector() {
  const [autoLogoutTimer, setAutoLogoutTimer] = React.useState<number>(15);
  const [selectedTimer, setSelectedTimer] = React.useState<string>('15');
  const [isCustom, setIsCustom] = React.useState(false);
  const [customValue, setCustomValue] = React.useState<string>('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = parseInt(localStorage.getItem('autoLogoutTimerMinutes') || '15', 10);
      setAutoLogoutTimer(saved);
      setSelectedTimer(saved.toString());
      if (![5, 15, 30, 60].includes(saved)) {
        setIsCustom(true);
        setCustomValue(saved.toString());
        setSelectedTimer('custom');
      }
    }
  }, []);

  const handleTimerChange = (mins: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('autoLogoutTimerMinutes', mins.toString());
      setAutoLogoutTimer(mins);
      window.dispatchEvent(new Event('storage')); // Notify other tabs/controllers
    }
  };

  const handleApplyTimer = () => {
    if (isCustom) {
      const val = parseInt(customValue, 10);
      if (!isNaN(val) && val > 0) {
        handleTimerChange(val);
      }
    } else {
      handleTimerChange(parseInt(selectedTimer, 10));
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-white/[0.02] rounded-[28px] p-5 border border-slate-100 dark:border-white/5 transition-all hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 shadow-sm border border-slate-100 dark:border-white/10">
          <Shield size={18} />
        </div>
        <div>
          <span className="block text-[10px] sm:text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest leading-tight mb-1">Automatic Log-out</span>
          <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Safe & Secure</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <CustomSelect
              value={isCustom ? 'custom' : selectedTimer}
              onChange={(val) => {
                setSelectedTimer(val);
                setIsCustom(val === 'custom');
              }}
              options={[
                { value: '5', label: '5 Minutes' },
                { value: '15', label: '15 Minutes' },
                { value: '30', label: '30 Minutes' },
                { value: '60', label: '60 Minutes' },
                { value: 'custom', label: 'Custom...' },
              ]}
              placeholder="Select time"
              className="!py-3 !px-5 !rounded-2xl !text-[11px] !bg-white dark:!bg-slate-800 border-slate-100 dark:border-white/10 shadow-sm font-bold tracking-wide"
            />
          </div>
          <button
            onClick={handleApplyTimer}
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 shrink-0 flex items-center gap-2"
          >
            {autoLogoutTimer.toString() === (isCustom ? customValue : selectedTimer) ? <Check size={14} /> : null}
            SET
          </button>
        </div>

        {isCustom && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="Mins"
              className="w-full px-5 py-3 rounded-2xl text-[11px] font-bold tracking-wide bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>
        )}
      </div> 
    </div>
  );
}
