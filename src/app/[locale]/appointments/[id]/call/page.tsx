'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  Settings, Users, MessageSquare, ShieldCheck,
  Maximize, Minimize, Loader2
} from 'lucide-react';

export default function VideoCallPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const appointmentId = resolvedParams.id;
  const router = useRouter();

  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleJoin = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsJoined(true);
    }, 2000);
  };

  const handleEndCall = () => {
    router.push('/appointments');
  };

  if (!isJoined && !isConnecting) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black uppercase tracking-widest">
              <ShieldCheck size={14} />
              End-to-End Encrypted
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
              Secure Video Consultation
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              You are about to join a private room for your appointment. Please ensure your camera and microphone are working.
            </p>
            <button 
              onClick={handleJoin}
              className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black uppercase tracking-widest text-sm transition-all shadow-2xl shadow-blue-500/20 active:scale-95"
            >
              Join Consultation
            </button>
          </div>

          <div className="relative aspect-video bg-slate-900 rounded-[40px] border border-white/5 overflow-hidden flex items-center justify-center group">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
             <div className="text-center space-y-4 relative z-10">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <Video size={32} className="text-slate-500" />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Preview Unavailable</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-6" />
        <p className="text-white font-black uppercase tracking-[0.3em] text-xs">Securing Connection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col">
      {/* Main Call Area */}
      <div className="flex-1 relative p-4 sm:p-8 flex items-center justify-center">
        {/* Peer Video (Specialist) */}
        <div className="w-full h-full max-w-6xl aspect-video bg-slate-900 rounded-[48px] border border-white/5 overflow-hidden relative shadow-2xl">
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                  <span className="text-4xl font-black text-blue-400">S</span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">Specialist Name</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Connecting...</p>
              </div>
           </div>
           <div className="absolute top-8 left-8 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white font-black text-[10px] uppercase tracking-widest">Live: Specialist</span>
           </div>
        </div>

        {/* Self Video (Overlay) */}
        <motion.div 
          drag
          dragConstraints={{ left: -400, right: 400, top: -200, bottom: 200 }}
          className="absolute bottom-12 right-12 w-48 sm:w-64 aspect-video bg-slate-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden cursor-move z-20"
        >
          {isVideoOff ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <VideoOff size={24} className="text-slate-600" />
            </div>
          ) : (
            <div className="w-full h-full bg-slate-700 relative">
               <div className="absolute inset-0 flex items-center justify-center opacity-20">
                 <Video size={40} className="text-white" />
               </div>
               <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
                 You (Me)
               </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Control Bar */}
      <div className="h-32 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-center px-8 relative z-30">
        <div className="flex items-center gap-4 sm:gap-8">
          <button 
            onClick={() => setIsMicMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
          >
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>

          <button 
            onClick={handleEndCall}
            className="w-20 h-14 bg-red-600 hover:bg-red-700 text-white rounded-[24px] flex items-center justify-center transition-all shadow-xl shadow-red-600/20 active:scale-95 mx-4"
          >
            <PhoneOff size={24} />
          </button>

          <button className="w-14 h-14 rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5 flex items-center justify-center transition-all">
            <MessageSquare size={20} />
          </button>

          <button className="w-14 h-14 rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5 flex items-center justify-center transition-all">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
