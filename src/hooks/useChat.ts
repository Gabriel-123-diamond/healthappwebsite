import { useState, useEffect } from 'react';
import { subscribeToMessages, sendMessage as sendMsgService } from '@/services/chatService';
import { ChatMessage } from '@/types/chat';

export function useChat(chatId: string, currentUserId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToMessages(chatId, (msgs) => {
      // Reverse to show oldest first (if that's the desired UI behavior)
      // or keep as is depending on UI. ChatWindow expected reversed.
      setMessages([...msgs].reverse());
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

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
