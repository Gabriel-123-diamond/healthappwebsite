export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: any; // Firestore timestamp
  status?: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: any;
}
