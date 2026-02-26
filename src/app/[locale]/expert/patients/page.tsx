'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { patientService } from '@/services/patientService';
import { PatientRecord } from '@/types/patient';
import { Users, Search, MoreHorizontal, User, Mail, Calendar, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ExpertLayout } from '@/components/expert/ExpertLayout';

export default function ExpertPatientsPage() {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    patientService.getMyPatients(user.uid).then(data => {
      setPatients(data);
      setLoading(false);
    });
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ExpertLayout
      title="Patient Management"
      subtitle="View and manage history for users you have consulted with."
    >
      <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-20 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
            <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium text-lg">No patients found. Patients appear here after a confirmed appointment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPatients.map((patient) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{patient.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {patient.email}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {patient.totalConsultations} Consults</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link 
                    href={`/expert/patients/${patient.id}`}
                    className="px-6 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                  >
                    View History
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
    </ExpertLayout>
  );
}
