import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore';
import { ChatMessage } from '@/types/chat';

const CHATS_COLLECTION = 'chats';
const MESSAGES_COLLECTION = 'messages';

export const getOrCreateChat = async (userId: string, otherUserId: string): Promise<string> => {
  const q = query(
    collection(db, CHATS_COLLECTION),
    where('participants', 'array-contains', userId)
  );

  const snapshot = await getDocs(q);
  let existingChat = snapshot.docs.find(doc => {
    const data = doc.data();
    return data.participants.includes(otherUserId);
  });

  if (existingChat) {
    return existingChat.id;
  }

  const newChat = await addDoc(collection(db, CHATS_COLLECTION), {
    participants: [userId, otherUserId],
    lastMessage: '',
    lastMessageTime: serverTimestamp(),
  });

  return newChat.id;
};

export const sendMessage = async (chatId: string, senderId: string, text: string) => {
  await addDoc(collection(db, CHATS_COLLECTION, chatId, MESSAGES_COLLECTION), {
    senderId,
    text,
    timestamp: serverTimestamp(),
  });

  await updateDoc(doc(db, CHATS_COLLECTION, chatId), {
    lastMessage: text,
    lastMessageTime: serverTimestamp(),
  });
};

export const subscribeToMessages = (chatId: string, callback: (messages: ChatMessage[]) => void) => {
  const q = query(
    collection(db, CHATS_COLLECTION, chatId, MESSAGES_COLLECTION),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
    callback(messages);
  });
};
