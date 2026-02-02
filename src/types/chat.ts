export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: any; // Firestore timestamp
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: any;
}
