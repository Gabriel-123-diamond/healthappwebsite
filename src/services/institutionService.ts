import { db, auth } from '@/lib/firebase';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, 
  query, where, addDoc, serverTimestamp, arrayUnion, arrayRemove, orderBy 
} from 'firebase/firestore';
import { Institution, InstitutionAuditEvent, InstitutionStaff, InstitutionStaffRole } from '@/types/institution';
import { PublicExpert } from '@/types/expert';

const INSTITUTIONS_COLLECTION = 'institutions';
const STAFF_INVITES_COLLECTION = 'staff_invites';

export const institutionService = {
  /**
   * Registers or updates an institutional node.
   */
  setupInstitution: async (uid: string, data: Partial<Institution>) => {
    const instRef = doc(db, INSTITUTIONS_COLLECTION, uid);
    await setDoc(instRef, {
      ...data,
      id: uid,
      verified: false,
      verificationStatus: 'pending',
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Link user profile to institution
    await updateDoc(doc(db, 'users', uid), {
      role: 'hospital',
      institutionId: uid,
      onboardingComplete: true
    });
  },

  /**
   * Sends an invitation to an expert/staff to join the institutional node.
   */
  inviteStaff: async (institutionId: string, institutionName: string, email: string, role: InstitutionStaffRole, departmentId?: string) => {
    await addDoc(collection(db, STAFF_INVITES_COLLECTION), {
      institutionId,
      institutionName,
      email: email.toLowerCase().trim(),
      role,
      departmentId: departmentId || null,
      status: 'pending',
      createdAt: serverTimestamp()
    });

    await institutionService.logAuditEvent({
      institutionId,
      actorUid: auth.currentUser?.uid || institutionId,
      action: 'staff_invited',
      departmentId,
      metadata: { email: email.toLowerCase().trim(), role },
      createdAt: new Date().toISOString()
    });
  },

  /**
   * Fetches linked staff (users) for an institution.
   */
  getStaff: async (institutionId: string): Promise<InstitutionStaff[]> => {
    const q = query(
      collection(db, 'users'),
      where('institutionId', '==', institutionId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        uid: doc.id, 
        fullName: data.fullName || 'Anonymous Node',
        email: data.email,
        role: data.institutionRole || 'practitioner',
        departmentId: data.departmentId,
        joinedAt: data.joinedAt?.toDate?.() || data.joinedAt
      } as InstitutionStaff;
    });
  },

  /**
   * Fetches linked experts for an institution.
   */
  getLinkedExperts: async (institutionId: string): Promise<PublicExpert[]> => {
    const q = query(
      collection(db, 'experts'),
      where('institutionId', '==', institutionId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PublicExpert));
  },

  /**
   * Removes an expert from the institution.
   */
  unlinkExpert: async (expertId: string) => {
    const expertRef = doc(db, 'experts', expertId);
    const userRef = doc(db, 'users', expertId);
    
    await Promise.all([
      updateDoc(expertRef, {
        institutionId: null,
        institutionName: null
      }),
      updateDoc(userRef, {
        institutionId: null,
        institutionRole: null,
        departmentId: null
      })
    ]);

    if (auth.currentUser?.uid) {
      await institutionService.logAuditEvent({
        institutionId: auth.currentUser.uid,
        actorUid: auth.currentUser.uid,
        action: 'staff_revoked',
        metadata: { expertId },
        createdAt: new Date().toISOString()
      });
    }
  },

  /**
   * Updates institutional departments.
   */
  updateDepartments: async (institutionId: string, departments: any[]) => {
    const instRef = doc(db, INSTITUTIONS_COLLECTION, institutionId);
    await updateDoc(instRef, {
      departments,
      updatedAt: serverTimestamp()
    });

    await institutionService.logAuditEvent({
      institutionId,
      actorUid: auth.currentUser?.uid || institutionId,
      action: 'department_changed',
      metadata: { departmentCount: departments.length },
      createdAt: new Date().toISOString()
    });
  },

  /**
   * Writes an immutable institutional audit entry.
   */
  logAuditEvent: async (event: Omit<InstitutionAuditEvent, 'id'>) => {
    await addDoc(collection(db, INSTITUTIONS_COLLECTION, event.institutionId, 'audit_trail'), {
      ...event,
      createdAt: serverTimestamp()
    });
  },

  /**
   * Updates institutional promotion and featured status.
   */
  updatePromotion: async (institutionId: string, promotionConfig: any, featured: boolean) => {
    const instRef = doc(db, INSTITUTIONS_COLLECTION, institutionId);
    await updateDoc(instRef, {
      promotionConfig,
      featured,
      updatedAt: serverTimestamp()
    });
  },

  /**
   * Updates institutional resources (beds, ventilators, etc.)
   */
  updateResources: async (institutionId: string, resources: any[]) => {
    const instRef = doc(db, INSTITUTIONS_COLLECTION, institutionId);
    await updateDoc(instRef, {
      resources,
      updatedAt: serverTimestamp()
    });
  },

  /**
   * Toggles the ER status (OPEN/CLOSED)
   */
  updateErStatus: async (institutionId: string, erStatus: 'OPEN' | 'CLOSED') => {
    const instRef = doc(db, INSTITUTIONS_COLLECTION, institutionId);
    await updateDoc(instRef, {
      erStatus,
      updatedAt: serverTimestamp()
    });
  },

  /**
   * Fetches all appointments for experts belonging to this institution.
   */
  getInstitutionalAppointments: async (institutionId: string): Promise<any[]> => {
    // 1. Get all experts in this institution
    const expertsQ = query(collection(db, 'experts'), where('institutionId', '==', institutionId));
    const expertsSnap = await getDocs(expertsQ);
    const expertIds = expertsSnap.docs.map(doc => doc.id);

    if (expertIds.length === 0) return [];

    // 2. Get all appointments for these experts
    // Firestore 'in' queries are limited to 10 items, but for this MVP it works
    const appointmentsQ = query(
      collection(db, 'appointments'), 
      where('expertId', 'in', expertIds.slice(0, 10)),
      orderBy('date', 'desc')
    );
    const appointmentsSnap = await getDocs(appointmentsQ);
    return appointmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

export async function getInstitutionById(id: string): Promise<Institution | undefined> {
  try {
    const docRef = doc(db, INSTITUTIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Institution;
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching institution:", error);
    return undefined;
  }
}

export async function getInstitutions(): Promise<Institution[]> {
  try {
    const snapshot = await getDocs(collection(db, INSTITUTIONS_COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Institution));
  } catch (error) {
    console.error("Error fetching institutions:", error);
    return [];
  }
}
