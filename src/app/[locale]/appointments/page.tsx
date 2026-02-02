'use client';

import React, { useState } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { getOrCreateChat } from '@/services/chatService';
import { Calendar, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ChatWindow from '@/components/chat/ChatWindow';
import AppointmentCard from '@/components/appointment/AppointmentCard';

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Please Log In</h1>
        <p className="text-slate-600 mb-6">You need to be logged in to view your appointments.</p>
        <button 
          onClick={() => router.push('/auth/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Appointments</h1>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">No appointments yet</h2>
            <p className="text-slate-500 mb-6">Book a consultation with one of our experts.</p>
            <button 
              onClick={() => router.push('/directory')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700"
            >
              Browse Directory
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appt) => (
              <AppointmentCard 
                key={appt.id} 
                appointment={appt} 
                onChatClick={handleStartChat} 
              />
            ))}
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
