import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Settings } from 'lucide-react';

interface CallControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isMuted, isVideoOff, onToggleMic, onToggleVideo, onEndCall
}) => {
  return (
    <div className="h-32 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-center px-8 relative z-30">
      <div className="flex items-center gap-4 sm:gap-8">
        <button 
          onClick={onToggleMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button 
          onClick={onToggleVideo}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
        >
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        <button 
          onClick={onEndCall}
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
  );
};
