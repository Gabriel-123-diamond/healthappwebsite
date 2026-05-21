'use client';

import React from 'react';
import { Calendar, User, AlertOctagon, HeartPulse } from 'lucide-react';
import Link from 'next/link';

interface GlobalTriageWidgetProps {
  t: any;
  appointments: any[];
  erStatus?: 'OPEN' | 'CLOSED';
}

export function GlobalTriageWidget({ t, appointments, erStatus = 'OPEN' }: GlobalTriageWidgetProps) {
  // Mock active emergency ambulance records that appear only during CLOSED (Crisis) mode
  const mockEmergencyDispatches = [
    {
      id: 'emergency-1',
      userName: 'Ambulance 07 - Cardiac Arrest',
      expertName: 'ER Trauma Team A',
      status: 'In Transit',
      date: new Date(),
      isEmergency: true
    },
    {
      id: 'emergency-2',
      userName: 'Unit 12 - Severe Trauma (MVA)',
      expertName: 'Critical ICU Team',
      status: 'In Transit',
      date: new Date(),
      isEmergency: true
    }
  ];

  const visibleAppointments = erStatus === 'CLOSED' 
    ? [...mockEmergencyDispatches, ...appointments] 
    : appointments;

  return (
    <section className="bg-[#0B1221]/50 backdrop-blur-xl rounded-[48px] border border-white/5 shadow-2xl overflow-hidden transition-all duration-300">
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)] ${
            erStatus === 'CLOSED' ? 'bg-red-500' : 'bg-blue-500'
          }`} />
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
            {erStatus === 'CLOSED' ? 'Emergency Queue' : t('recentRegistry')}
          </h3>
        </div>
        <Link 
          href="/hospital/registry" 
          className="text-[9px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors"
        >
          {t('viewFullRegistry')}
        </Link>
      </div>

      {erStatus === 'CLOSED' && (
        <div className="p-6 bg-red-950/20 border-b border-red-500/10 flex items-center gap-4 animate-pulse">
          <AlertOctagon className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-[9px] font-black uppercase text-red-500 tracking-[0.25em]">DIVERSION MODE ACTIVE</p>
            <p className="text-[8px] font-bold text-red-400 uppercase tracking-widest mt-0.5">
              Facility at full capacity. All non-critical incoming units diverted to nearest node.
            </p>
          </div>
        </div>
      )}

      <div className="divide-y divide-white/5">
        {visibleAppointments.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="text-slate-700" size={32} />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('noActivity')}</p>
          </div>
        ) : (
          visibleAppointments.slice(0, 5).map((app) => (
            <div 
              key={app.id} 
              className={`p-6 flex items-center justify-between hover:bg-white/5 transition-all group ${
                app.isEmergency ? 'bg-red-950/10 border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-12 h-12 bg-[#020617] border rounded-2xl flex items-center justify-center text-slate-500 transition-all ${
                    app.isEmergency 
                      ? 'border-red-500/20 text-red-400 group-hover:text-red-300' 
                      : 'border-white/5 group-hover:text-blue-400 group-hover:border-blue-500/20'
                  }`}>
                    {app.isEmergency ? <HeartPulse size={20} className="animate-pulse" /> : <User size={20} />}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0B1221] shadow-lg ${
                    app.isEmergency ? 'bg-red-500' : 'bg-emerald-500'
                  }`} />
                </div>
                <div>
                  <p className={`text-xs font-black uppercase tracking-tight ${app.isEmergency ? 'text-red-400' : 'text-white'}`}>
                    {app.userName || 'Patient Node'}
                  </p>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">
                    Node: {app.expertName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                  app.isEmergency ? 'bg-red-500/20 border-red-500/30 text-red-400 animate-pulse' :
                  app.status === 'Checked In' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                  app.status === 'Discharged' ? 'bg-white/5 border-white/10 text-slate-500' :
                  'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                  {app.status || 'Scheduled'}
                </span>
                <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mt-2">
                  {app.isEmergency ? 'Active Dispatch' : new Date(app.date?.toDate?.() || app.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
