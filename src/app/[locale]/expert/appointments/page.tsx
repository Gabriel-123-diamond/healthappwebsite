'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { getExpertAppointments, updateAppointmentStatus } from '@/services/appointmentService';
import { Appointment } from '@/types/appointment';
import { Calendar, Clock, User, CheckCircle, XCircle, Loader2, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpertLayout } from '@/components/expert/ExpertLayout';

export default function ExpertAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = getExpertAppointments(user.uid, (data) => {
      setAppointments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateAppointmentStatus(id, status);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    filter === 'all' ? true : apt.status === filter
  );

  return (
    <ExpertLayout
      title="Appointment Management"
      subtitle="Manage your patient bookings and consultations."
    >
      <div className="flex gap-2 mb-8 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-20 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
            <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium text-lg">No appointments found matching your filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredAppointments.map((apt) => (
                <motion.div
                  key={apt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-400" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Patient UID: {apt.userId.substring(0, 8)}...</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {apt.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {apt.time}
                      </div>
                    </div>
                  </div>

                  {apt.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                        className="flex-grow flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all"
                      >
                        <CheckCircle className="w-4 h-4" /> Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                        className="flex-grow flex items-center justify-center gap-2 py-2.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
    </ExpertLayout>
  );
}
