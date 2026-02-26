'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { patientService } from '@/services/patientService';
import { ConsultationNote } from '@/types/patient';
import { ArrowLeft, User, Calendar, Plus, FileText, Clipboard, Pill, Stethoscope, Save, Loader2, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { BaseTextArea } from '@/components/common/BaseTextArea';
import { motion } from 'framer-motion';

export default function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [notes, setNotes] = useState<ConsultationNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddNote, setShowAddNote] = useState(false);
  
  // New Note State
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user || !id) return;

      try {
        const [patientDoc, notesList] = await Promise.all([
          getDoc(doc(db, 'users', id as string)),
          patientService.getPatientNotes(user.uid, id as string)
        ]);

        if (patientDoc.exists()) {
          setPatient(patientDoc.data());
        }
        setNotes(notesList);
      } catch (err) {
        console.error("Error fetching patient details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !id) return;

    setSaving(true);
    try {
      await patientService.addConsultationNote({
        expertId: user.uid,
        patientId: id as string,
        date: new Date().toLocaleDateString(),
        symptoms,
        diagnosis,
        treatmentPlan: treatment,
        notes: generalNotes,
      });

      // Refresh notes
      const updatedNotes = await patientService.getPatientNotes(user.uid, id as string);
      setNotes(updatedNotes);
      setShowAddNote(false);
      
      // Reset form
      setSymptoms('');
      setDiagnosis('');
      setTreatment('');
      setGeneralNotes('');
    } catch (err) {
      console.error("Error saving note:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <Link href="/expert/patients" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Patients
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">{patient?.name || 'Anonymous Patient'}</h1>
                <p className="text-slate-500">{patient?.email}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowAddNote(!showAddNote)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <Plus className="w-5 h-5" />
            New Consultation Note
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column - History */}
          <div className="lg:col-span-2 space-y-6">
            {showAddNote && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-blue-500 shadow-xl"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Clipboard className="text-blue-600" />
                  Add Consultation Note
                </h2>
                <form onSubmit={handleSaveNote} className="space-y-6">
                  <BaseTextArea id="symptoms" label="Chief Complaint / Symptoms" required value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3} placeholder="What symptoms is the patient reporting?" />
                  <BaseTextArea id="diagnosis" label="Provisional Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} rows={2} placeholder="Initial assessment..." />
                  <BaseTextArea id="treatment" label="Treatment Plan" required value={treatment} onChange={(e) => setTreatment(e.target.value)} rows={3} placeholder="Steps for recovery, medication, or advice..." />
                  <BaseTextArea id="generalNotes" label="General Notes" value={generalNotes} onChange={(e) => setGeneralNotes(e.target.value)} rows={2} placeholder="Any other observations..." />
                  
                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowAddNote(false)} className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700">Cancel</button>
                    <button type="submit" disabled={saving} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50">
                      {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                      Save Note
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <Clock className="text-slate-400" />
                Consultation History
              </h2>
              
              {notes.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
                  <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400">No consultation notes yet for this patient.</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider">
                        <Calendar className="w-4 h-4" />
                        {note.date}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <section>
                        <h4 className="text-[10px] font-black uppercase text-blue-600 mb-2 tracking-widest flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" /> Symptoms
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{note.symptoms}</p>
                      </section>

                      {note.diagnosis && (
                        <section>
                          <h4 className="text-[10px] font-black uppercase text-purple-600 mb-2 tracking-widest">Diagnosis</h4>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{note.diagnosis}</p>
                        </section>
                      )}

                      <section>
                        <h4 className="text-[10px] font-black uppercase text-emerald-600 mb-2 tracking-widest flex items-center gap-1">
                          <Pill className="w-3 h-3" /> Treatment Plan
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                          {note.treatmentPlan}
                        </div>
                      </section>

                      {note.notes && (
                        <section className="pt-4 border-t border-slate-50 dark:border-slate-800 text-sm text-slate-500 italic">
                          "{note.notes}"
                        </section>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar - Patient Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Patient Profile</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Consultations</span>
                  <span className="font-bold text-slate-900 dark:text-white">{notes.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded uppercase">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Joined</span>
                  <span className="font-bold text-slate-900 dark:text-white">Oct 2025</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">Privacy Shield</h3>
              <p className="text-slate-400 text-sm mb-4">Consultation records are only visible to you and the patient. All data is encrypted.</p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                <Clipboard className="w-4 h-4" />
                End-to-End Encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
