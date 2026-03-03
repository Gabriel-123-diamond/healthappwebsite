'use client';

import { useState, useEffect } from 'react';
import { subscribeToMessages, sendMessage as sendMsgService, markMessagesAsRead } from '@/services/chatService';
import { ChatMessage } from '@/types/chat';

export function useChat(chatId: string, currentUserId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToMessages(chatId, (msgs) => {
      // Reverse to show oldest first
      setMessages([...msgs].reverse());
      setLoading(false);
      
      // Check for unread messages sent by the other user and mark them as read
      const hasUnread = msgs.some(m => m.senderId !== currentUserId && m.status !== 'read');
      if (hasUnread) {
        markMessagesAsRead(chatId, currentUserId).catch(console.error);
      }
    });

    return () => unsubscribe();
  }, [chatId, currentUserId]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    try {
      await sendMsgService(chatId, currentUserId, text.trim());
      setError(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      throw err;
    }
  };

  return { messages, loading, error, sendMessage };
}
