import React from 'react';
import { Appointment } from '@/types/appointment';
import { Calendar, Clock, MessageCircle } from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
  onChatClick: (expertId: string, expertName: string) => void;
}

export default function AppointmentCard({ appointment, onChatClick }: AppointmentCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-slate-900">{appointment.expertName}</h3>
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
            appointment.status === 'confirmed' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {appointment.status}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-slate-600 text-sm">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(appointment.date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {appointment.time}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button 
          onClick={() => onChatClick(appointment.expertId, appointment.expertName)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </button>
      </div>
    </div>
  );
}
