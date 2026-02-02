import React from 'react';
import { MapPin, Phone, Globe, Clock } from 'lucide-react';
import BookAppointmentButton from './BookAppointmentButton';

interface ExpertContactCardProps {
  location: string;
  expertId: string;
  expertName: string;
}

export default function ExpertContactCard({ location, expertId, expertName }: ExpertContactCardProps) {
  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
      <h3 className="font-bold text-slate-900 mb-4">Contact Information</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-slate-900">Address</div>
            <div className="text-sm text-slate-500">{location}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-slate-900">Phone</div>
            <div className="text-sm text-slate-500">+1 (555) 123-4567</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-slate-900">Website</div>
            <div className="text-sm text-slate-500 text-blue-600 hover:underline cursor-pointer">Visit Website</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-slate-900">Hours</div>
            <div className="text-sm text-slate-500">Mon-Fri: 9am - 5pm</div>
          </div>
        </div>
      </div>
      
      <BookAppointmentButton expertId={expertId} expertName={expertName} />
    </div>
  );
}
