import React from 'react';
import { ChatMessage } from '@/types/chat';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const renderStatus = () => {
    if (!isMe) return null;
    
    if (message.status === 'read') {
      return <CheckCheck className="w-3.5 h-3.5 text-blue-300 ml-1 inline-block" />;
    }
    if (message.status === 'delivered') {
      return <CheckCheck className="w-3.5 h-3.5 text-blue-200 opacity-70 ml-1 inline-block" />;
    }
    return <Check className="w-3.5 h-3.5 text-blue-200 opacity-70 ml-1 inline-block" />;
  };

  return (
    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[80%] px-4 py-2.5 text-[13px] sm:text-sm font-medium leading-relaxed shadow-sm ${
          isMe
            ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
            : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl rounded-bl-sm'
        }`}
      >
        <div className="flex items-end gap-2">
          <span>{message.text}</span>
          {isMe && (
            <div className="flex-shrink-0 mb-[2px]">
              {renderStatus()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
