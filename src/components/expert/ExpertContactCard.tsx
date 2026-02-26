import React from 'react';
import { MapPin, Phone, Globe, Clock, ShieldCheck, Mail } from 'lucide-react';
import BookAppointmentButton from './BookAppointmentButton';

interface ExpertContactCardProps {
  location: string;
  expertId: string;
  expertName: string;
}

export default function ExpertContactCard({ location, expertId, expertName }: ExpertContactCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
      <div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-1">Contact Protocol</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Official Channel</p>
      </div>

      <div className="space-y-6">
        <ContactItem 
          icon={<MapPin className="w-5 h-5 text-blue-600" />} 
          label="Registry Location" 
          value={location} 
        />
        <ContactItem 
          icon={<Phone className="w-5 h-5 text-blue-600" />} 
          label="Verification Phone" 
          value="+1 (555) 123-4567" 
        />
        <ContactItem 
          icon={<Mail className="w-5 h-5 text-blue-600" />} 
          label="Encrypted Email" 
          value="expert.verified@ikike.ai" 
        />
        <ContactItem 
          icon={<Clock className="w-5 h-5 text-blue-600" />} 
          label="Consultation Hours" 
          value="Mon-Fri: 9am - 5pm" 
        />
      </div>

      <div className="pt-4">
        <BookAppointmentButton expertId={expertId} expertName={expertName} />
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-500" />
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
          Communications are secured using end-to-end clinical grade encryption.
        </p>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:border-blue-200 transition-all duration-300">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}
