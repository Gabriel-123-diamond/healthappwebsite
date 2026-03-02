'use client';

import React, { useState } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { getOrCreateChat } from '@/services/chatService';
import { Calendar, AlertCircle, ChevronLeft, Loader2, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ChatWindow from '@/components/chat/ChatWindow';
import AppointmentCard from '@/components/appointment/AppointmentCard';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppointmentsPage() {
  const { appointments, loading, user } = useAppointments();
  const [activeChat, setActiveChat] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();

  const handleStartChat = async (expertId: string, expertName: string) => {
    if (!user) return;
    try {
      const chatId = await getOrCreateChat(user.uid, expertId);
      setActiveChat({ id: chatId, name: expertName });
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Could not start chat. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Appointments</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-red-600">
            <AlertCircle size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Authentication Required</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Please sign in to access your secure clinical consultation history.</p>
          <button 
            onClick={() => router.push('/auth/signin')}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <Link href="/" className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-4">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Intelligence Hub
            </Link>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">My Appointments</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your clinical consultations and expert interactions.</p>
          </div>
        </div>

        {appointments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-[48px] shadow-3xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 p-12 sm:p-20 text-center"
          >
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
              <Calendar className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">No active schedules</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-md mx-auto font-medium">Initialize your health journey by connecting with verified clinical or herbal specialists from our registry.</p>
            <button 
              onClick={() => router.push('/directory')}
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/20"
            >
              <BookOpen size={16} />
              Browse Registry
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {appointments.map((appt, idx) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <AppointmentCard 
                    appointment={appt} 
                    onChatClick={handleStartChat} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {activeChat && (
        <ChatWindow 
          chatId={activeChat.id}
          currentUserId={user.uid}
          recipientName={activeChat.name}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}
