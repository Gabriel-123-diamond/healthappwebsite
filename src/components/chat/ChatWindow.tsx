'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { X, Send } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  chatId: string;
  currentUserId: string;
  recipientName: string;
  onClose: () => void;
}

export default function ChatWindow({ chatId, currentUserId, recipientName, onClose }: ChatWindowProps) {
  const { messages, sendMessage } = useChat(chatId, currentUserId);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      // Error handled in hook or ignored here
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-t-xl rounded-b-xl shadow-2xl border border-slate-200 flex flex-col h-[500px] z-50 animate-in slide-in-from-bottom-10 duration-200">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
        <div className="font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          {recipientName}
        </div>
        <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-4">
            Start a conversation with {recipientName}
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isMe={msg.senderId === currentUserId} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
