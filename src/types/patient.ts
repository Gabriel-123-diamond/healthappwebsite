export interface ConsultationNote {
  id: string;
  expertId: string;
  patientId: string;
  appointmentId?: string;
  date: string;
  symptoms: string;
  diagnosis?: string;
  treatmentPlan: string;
  prescriptions?: string[];
  notes: string;
  createdAt: string;
}

export interface PatientRecord {
  id: string; // This is the user's UID
  name: string;
  email: string;
  lastConsultation?: string;
  totalConsultations: number;
  tags?: string[];
  status: 'active' | 'archived';
}
