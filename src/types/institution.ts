export type InstitutionStaffRole =
  | 'network_admin'
  | 'admin'
  | 'head'
  | 'practitioner'
  | 'receptionist'
  | 'audit';

export type InstitutionAuditAction =
  | 'patient_record_read'
  | 'patient_record_write'
  | 'staff_invited'
  | 'staff_revoked'
  | 'department_changed'
  | 'triage_status_changed';

export interface InstitutionStaff {
  uid: string;
  fullName: string;
  email: string;
  role: InstitutionStaffRole;
  branchId?: string;
  departmentId?: string;
  status?: 'active' | 'on_leave' | 'revoked';
  joinedAt: string | any;
}

export interface InstitutionAuditEvent {
  id?: string;
  institutionId: string;
  actorUid: string;
  action: InstitutionAuditAction;
  patientId?: string;
  appointmentId?: string;
  departmentId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string | any;
}

export interface InstitutionResource {
  id: string;
  label: string;
  available: number;
  total: number;
  color: string;
}

export interface Institution {
  id: string;
  name: string;
  type: 'Hospital' | 'University' | 'NGO' | 'Clinic';
  location: string;
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  website?: string;
  verified: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  permitUrl?: string;
  parentInstitutionId?: string;
  branchName?: string;
  compliance?: {
    auditTrailEnabled: boolean;
    patientRecordAccessLogging: boolean;
    dataRegion?: string;
  };
  erStatus?: 'OPEN' | 'CLOSED';
  resources?: InstitutionResource[];
  contactNodes: {
    id: string;
    label: string; // e.g., 'Emergency Node', 'Pharmacy Node'
    phone: string;
    email?: string;
    available24h: boolean;
  }[];
  departments: {
    id: string;
    name: string;
    description?: string;
    headExpertId?: string; // UID of the department head
    icon?: string;
    color?: string; // e.g., 'red' for ER
  }[];
  operatingHours?: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  insuranceAccepted?: string[];
  specialties: string[];
  featured: boolean; // Stage 4: Featured Placement
  promotionConfig?: {
    region: string;
    priority: number; // 1-10
    expiresAt: string;
  };
  stats: {
    experts: number;
    publications: number;
    followers: number;
  };
  library?: {
    id: string;
    title: string;
    description: string;
    isPremium: boolean;
    resources: {
      id: string;
      title: string;
      type: 'PDF' | 'Video' | 'Protocol';
      url: string;
    }[];
  }[];
}
