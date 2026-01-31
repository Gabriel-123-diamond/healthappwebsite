'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtSign, Loader2, Check, X, Phone, ChevronDown, MapPin, UserCircle, Stethoscope, Leaf, Building2, Search } from 'lucide-react';

interface StepRendererProps {
  step: number;
  formData: any;
  setFormData: (data: any) => void;
  usernameStatus: string;
  phoneStatus: string;
  nameStatus: string;
  countries: any[];
  roles: any[];
  locationData: any;
  requestLocation: () => void;
  toggleInterest: (interest: string) => void;
  t: (key: string) => string;
}

export default function StepRenderer({
  step,
  formData,
  setFormData,
  usernameStatus,
  phoneStatus,
  nameStatus,
  countries,
  roles,
  locationData,
  requestLocation,
  toggleInterest,
  t
}: StepRendererProps) {
  
  // Helper to update country code
  const handleCountryChange = (val: string) => {
    setFormData({ ...formData, countryCode: val });
  };

  // Helper to update age
  const handleAgeChange = (val: string) => {
    setFormData({ ...formData, ageRange: val });
  };

  switch (step) {
    case 1:
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-2">Basic Information</h3>
            <p className="text-slate-500 font-medium text-sm">Tell us who you are. This information will help others identify you.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">First Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                  className={`w-full px-5 py-4 rounded-2xl bg-white border outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:font-normal placeholder:text-slate-400 ${
                    nameStatus === 'taken' ? 'border-red-500 focus:ring-red-200' : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/5'
                  }`}
                  placeholder="John" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Last Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                  className={`w-full px-5 py-4 rounded-2xl bg-white border outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:font-normal placeholder:text-slate-400 ${
                    nameStatus === 'taken' ? 'border-red-500 focus:ring-red-200' : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/5'
                  }`}
                  placeholder="Doe" 
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {nameStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                  {nameStatus === 'taken' && <div className="p-1 bg-red-100 rounded-full"><X className="w-3 h-3 text-red-600" /></div>}
                  {nameStatus === 'available' && <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-3 h-3 text-emerald-600" /></div>}
                </div>
              </div>
            </div>
          </div>
          {nameStatus === 'taken' && <p className="text-xs text-red-500 font-bold ml-1">Name combination is unavailable.</p>}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Username</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-50 group-focus-within:bg-blue-50 transition-colors">
                <AtSign className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
              </div>
              <input 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                className={`w-full pl-16 pr-12 py-4 rounded-2xl bg-white border outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:font-normal placeholder:text-slate-400 ${
                  usernameStatus === 'taken' ? 'border-red-500 focus:ring-red-200' : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/5'
                }`}
                placeholder="johndoe"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2">
                {usernameStatus === 'checking' && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                {usernameStatus === 'available' && <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-3 h-3 text-emerald-600" /></div>}
                {usernameStatus === 'taken' && <div className="p-1 bg-red-100 rounded-full"><X className="w-3 h-3 text-red-600" /></div>}
              </div>
            </div>
            {usernameStatus === 'taken' && <p className="text-xs text-red-500 font-bold ml-1">Username is already taken.</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Phone Number</label>
            <div className="flex gap-3 relative z-20">
              <div className="w-36">
                <CustomSelect
                  value={formData.countryCode}
                  onChange={handleCountryChange}
                  options={countries.map(c => ({ 
                    value: c.code, 
                    label: `${t(`countries.${c.name}`)} (${c.code})` 
                  }))}
                  placeholder="+1"
                />
              </div>
              <div className="relative flex-1">
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => {
                    const selectedCountry = countries.find(c => c.code === formData.countryCode);
                    const limit = selectedCountry?.max || 15;
                    const val = e.target.value.replace(/\D/g, '').slice(0, limit);
                    setFormData({...formData, phone: val});
                  }}
                  onKeyDown={(e) => {
                    const selectedCountry = countries.find(c => c.code === formData.countryCode);
                    const limit = selectedCountry?.max || 15;
                    if (formData.phone.length >= limit && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                      e.preventDefault();
                    }
                    if (!/[0-9]/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full px-5 py-4 rounded-2xl bg-white border outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:font-normal placeholder:text-slate-400 ${
                    phoneStatus === 'taken' ? 'border-red-500 focus:ring-red-200' : 
                    (formData.phone && formData.phone.length < (countries.find(c => c.code === formData.countryCode)?.min || 0)) ? 'border-amber-400 focus:ring-amber-100' :
                    'border-slate-100 focus:border-blue-500 focus:ring-blue-500/5'
                  }`} 
                  placeholder="801 234 5678" 
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {formData.phone && formData.phone.length < (countries.find(c => c.code === formData.countryCode)?.min || 0) && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">NOT VALID YET</span>
                  )}
                  {phoneStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                  {phoneStatus === 'taken' && <div className="p-1 bg-red-100 rounded-full"><X className="w-3 h-3 text-red-600" /></div>}
                  {phoneStatus === 'available' && formData.phone.length >= (countries.find(c => c.code === formData.countryCode)?.min || 0) && <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-3 h-3 text-emerald-600" /></div>}
                </div>
              </div>
            </div>
            {phoneStatus === 'taken' && <p className="text-xs text-red-500 font-bold ml-1">Phone number is already associated with an account.</p>}
          </div>

          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Age Range</label>
            <CustomSelect
              value={formData.ageRange}
              onChange={handleAgeChange}
              options={['18-24', '25-34', '35-44', '45-54', '55+'].map(a => ({ value: a, label: a }))}
              placeholder="Select Age Range"
            />
          </div>
        </motion.div>
      );
    
    // ... Cases 2, 3, 4 remain similar but we can just leave them as they are since they don't use Selects
    case 2:
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-2">Professional Role</h3>
            <p className="text-slate-500 font-medium text-sm">Are you joining as a citizen seeker or a health professional?</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setFormData({...formData, role: role.id})}
                className={`flex flex-col items-start p-6 rounded-[32px] border-2 transition-all text-left relative overflow-hidden group ${
                  formData.role === role.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 bg-white hover:border-blue-100'
                }`}
              >
                <div className={`p-3.5 rounded-2xl mb-5 transition-all duration-500 ${
                  formData.role === role.id 
                    ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-200' 
                    : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                }`}>
                  <role.icon size={22} />
                </div>
                <span className={`font-black text-lg mb-1.5 ${formData.role === role.id ? 'text-blue-900' : 'text-slate-900'}`}>{role.label}</span>
                <span className="text-xs text-slate-500 font-medium leading-relaxed opacity-80">{role.desc}</span>
                
                {formData.role === role.id && (
                  <div className="absolute top-4 right-4">
                    <div className="p-1 bg-blue-600 rounded-full">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      );
    case 3:
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <div className="flex justify-between items-center bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
            <div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">Your Location</h3>
              <p className="text-slate-500 font-medium text-sm">Click the pin to auto-fill your location.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button 
                onClick={requestLocation} 
                className={`p-4 rounded-2xl transition-all border group flex items-center gap-3 ${
                  locationData 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider">
                  {locationData ? 'Location Found' : 'Auto-Detect'}
                </span>
                <MapPin className={`w-6 h-6 ${locationData ? 'fill-emerald-600' : 'group-hover:scale-110'}`} />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">City</label>
              <input 
                type="text" 
                value={formData.city} 
                onChange={(e) => setFormData({...formData, city: e.target.value})} 
                className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-slate-900 shadow-sm" 
                placeholder="e.g. San Francisco" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Country</label>
              <input 
                type="text" 
                value={formData.country} 
                onChange={(e) => setFormData({...formData, country: e.target.value})} 
                className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-slate-900 shadow-sm" 
                placeholder="e.g. United States" 
              />
            </div>
          </div>
        </motion.div>
      );
    case 4:
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-2">Health Interests</h3>
            <p className="text-slate-500 font-medium text-sm">Select topics to personalize your intelligence feed.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Herbal Medicine', 'Cardiology', 'Mental Health', 'Nutrition', 'Yoga', 'Diabetes', 'Fitness', 'Sleep'].map((topic) => (
              <button 
                key={topic} 
                onClick={() => toggleInterest(topic)} 
                className={`p-5 rounded-3xl text-sm font-black transition-all border-2 text-center flex items-center justify-center h-20 ${
                  formData.interests.includes(topic) 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200 scale-105' 
                    : 'bg-white text-slate-600 border-slate-50 hover:border-blue-100 hover:bg-slate-50/50'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </motion.div>
      );
    default:
      return null;
  }
}

// Modern Custom Select Component
function CustomSelect({ value, onChange, options, placeholder }: { value: string, onChange: (val: string) => void, options: { value: string, label: string }[], placeholder: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  const filteredOptions = options.filter(o => 
    o.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between outline-none transition-all font-bold text-slate-900 shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/5 ${isOpen ? 'border-blue-500 ring-4 ring-blue-500/5' : ''}`}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400 font-normal'}>
          {selectedLabel}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute top-full mt-2 left-0 w-64 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 max-h-80 overflow-hidden flex flex-col p-2"
          >
            <div className="relative mb-2 px-2">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                autoFocus
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {filteredOptions.length > 0 ? filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    value === option.value 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              )) : (
                <p className="p-4 text-center text-xs text-slate-400 font-medium">No results found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}