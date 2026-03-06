export interface Appointment {
  id: string;
  userId: string;
  expertId: string;
  expertName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  fee?: number;
  paid?: boolean;
  createdAt: string;
  meetingLink?: string;
  meetingId?: string;
}
