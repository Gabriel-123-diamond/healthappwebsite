import { Timestamp } from 'firebase/firestore';

export interface Referral {
  id: string;
  referrerUid: string;
  inviteeUid: string;
  inviteeEmail: string | null;
  code: string;
  status: 'pending' | 'completed';
  createdAt: Timestamp;
  completedAt?: Timestamp;
}
