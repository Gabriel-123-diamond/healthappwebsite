'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Video, VideoOff } from 'lucide-react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { CallLobby } from '@/components/appointment/call/CallLobby';
import { CallConnecting } from '@/components/appointment/call/CallConnecting';
import { CallControls } from '@/components/appointment/call/CallControls';

export default function VideoCallPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const appointmentId = resolvedParams.id;
  const router = useRouter();

  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const { localVideoRef, remoteVideoRef, remoteStream } = useWebRTC(
    appointmentId,
    isJoined,
    isMuted,
    isVideoOff
  );

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
    return <CallLobby onJoin={handleJoin} />;
  }

  if (isConnecting) {
    return <CallConnecting />;
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col pt-16">
      {/* Main Call Area */}
      <div className="flex-1 relative p-4 sm:p-8 flex items-center justify-center">
        {/* Peer Video (Specialist) */}
        <div className="w-full h-full max-w-6xl aspect-video bg-slate-900 rounded-[48px] border border-white/5 overflow-hidden relative shadow-2xl">
           <video 
             ref={remoteVideoRef} 
             autoPlay 
             playsInline 
             className="absolute inset-0 w-full h-full object-cover rounded-[48px]" 
           />
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {!remoteStream && (
                <div className="text-center">
                  <div className="w-32 h-32 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                    <span className="text-4xl font-black text-blue-400">S</span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">Specialist Name</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Connecting...</p>
                </div>
              )}
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
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" 
          />
          {isVideoOff ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
              <VideoOff size={24} className="text-slate-600" />
            </div>
          ) : (
            <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest z-10">
              You (Me)
            </div>
          )}
        </motion.div>
      </div>

      <CallControls 
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        onToggleMic={() => setIsMicMuted(!isMuted)}
        onToggleVideo={() => setIsVideoOff(!isVideoOff)}
        onEndCall={handleEndCall}
      />
    </div>
  );
}
