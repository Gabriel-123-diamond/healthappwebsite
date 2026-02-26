import { db, storage } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface VerificationRequest {
  expertId: string;
  licenseNumber: string;
  documentType: 'license' | 'id' | 'certificate' | 'other';
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: any;
  notes?: string;
}

export const verificationService = {
  /**
   * Uploads a document to Firebase Storage.
   * @param expertId The expert's ID.
   * @param file The file to upload.
   * @param type The type of document.
   */
  uploadDocument: async (expertId: string, file: File, type: string) => {
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const storageRef = ref(storage, `verifications/${expertId}/${type}_${timestamp}_${uniqueId}.${extension}`);
    
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  /**
   * Submits a verification application.
   * @param expertId The expert's ID.
   * @param licenseNumber The professional license number.
   * @param documentUrl URL of the uploaded credential.
   * @param documentType Type of the uploaded credential.
   */
  submitApplication: async (
    expertId: string, 
    licenseNumber: string, 
    documentUrl: string, 
    documentType: 'license' | 'id' | 'certificate' | 'other'
  ) => {
    // 1. Create the verification request record
    const requestData = {
      expertId,
      licenseNumber,
      documentType,
      documentUrl,
      status: 'pending',
      submittedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'verification_requests'), requestData);

    // 2. Update the user's verification status
    const userRef = doc(db, 'users', expertId);
    await updateDoc(userRef, {
      verificationStatus: 'pending',
      lastVerificationRequestId: docRef.id,
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  }
};
