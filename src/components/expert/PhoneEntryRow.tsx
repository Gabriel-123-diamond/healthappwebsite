import React from 'react';
import { Trash2, Shield, ChevronDown } from 'lucide-react';
import CustomSelect from '../common/CustomSelect';
import { countries } from '@/data/countries';
import { PhoneEntry } from './ExpertPhoneManager';

const DEFAULT_LABELS = ["Office", "Mobile", "Home", "Fax", "WhatsApp", "Emergency", "Primary"];

interface PhoneEntryRowProps {
  phone: PhoneEntry;
  index: number;
  totalPhones: number;
  primaryPhoneDisabled: boolean;
  onRemove: (index: number) => void;
  onUpdate: (index: number, updates: Partial<PhoneEntry>) => void;
}

export function PhoneEntryRow({
  phone,
  index,
  totalPhones,
  primaryPhoneDisabled,
  onRemove,
  onUpdate,
}: PhoneEntryRowProps) {
  const isPrimary = index === 0 && primaryPhoneDisabled;
  const selectedCountry = countries.find(c => c.code === phone.code);
  const maxLen = selectedCountry?.max || 15;

  return (
    <div 
      className={`group relative flex flex-col xl:flex-row items-stretch xl:items-center rounded-2xl border transition-all duration-300 ${
        isPrimary 
          ? 'border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 shadow-sm' 
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Label Section */}
      <div className="w-full xl:w-32 2xl:w-40 p-1 border-b xl:border-b-0 xl:border-r border-slate-100 dark:border-slate-800 shrink-0">
        <div className="relative group/label">
          <select
            value={phone.label}
            disabled={true} // Always disabled for existing numbers
            onChange={(e) => onUpdate(index, { label: e.target.value })}
            className="w-full h-10 md:h-12 px-4 text-[10px] sm:text-xs font-black uppercase tracking-wider bg-transparent border-none focus:ring-0 outline-none text-slate-600 dark:text-slate-300 cursor-pointer disabled:cursor-not-allowed appearance-none"
          >
            {DEFAULT_LABELS.map(l => <option key={l} value={l} className="font-bold text-slate-700 dark:bg-slate-900">{l}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none opacity-0 transition-colors" />
        </div>
      </div>

      {/* Country Code Section */}
      <div className="w-full xl:w-32 2xl:w-40 border-b xl:border-b-0 xl:border-r border-slate-100 dark:border-slate-800 shrink-0">
        <CustomSelect
          value={countries.find(c => c.code === phone.code)?.code + ":" + countries.find(c => c.code === phone.code)?.name}
          disabled={true} // Always disabled for existing numbers
          onChange={(val) => {
            const [code] = val.split(':');
            onUpdate(index, { code });
          }}
          options={countries.map(c => ({ 
            value: `${c.code}:${c.name}`, 
            key: `${c.code}-${c.name}`,
            label: `${c.flag} ${c.code} (${c.name.charAt(0).toUpperCase() + c.name.slice(1)})` 
          }))}
          placeholder="+1"
          className="h-10 md:h-12 border-none bg-transparent shadow-none hover:border-none focus:ring-0 px-4 text-xs sm:text-sm font-bold"
          optionClassName="text-xs"
        />
      </div>

      {/* Number Section */}
      <div className="flex-1 relative flex items-center min-w-0">
        <input
          type="tel"
          value={phone.number}
          disabled={true} // Always disabled for existing numbers
          suppressHydrationWarning
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d+]/g, '').slice(0, maxLen);
            const formatted = raw.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
            onUpdate(index, { number: formatted });
          }}
          placeholder="801 234 5678"
          className="w-full h-10 md:h-12 px-5 bg-transparent border-none focus:ring-0 outline-none text-sm sm:text-base font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 min-w-0 tracking-wider"
        />
        
        <div className="absolute right-2 md:right-4 flex items-center gap-2 sm:gap-3 shrink-0">
          {phone.isVerified && (
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-blue-600 dark:bg-blue-500 rounded-full shadow-lg shadow-blue-200/50">
               <Shield size={10} className="text-white" />
               <span className="text-[7px] sm:text-[8px] font-black text-white uppercase tracking-tighter">Verified</span>
            </div>
          )}
          
          {totalPhones > 1 && (
            <button 
              onClick={() => onRemove(index)}
              className="p-1 sm:p-1.5 text-slate-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
