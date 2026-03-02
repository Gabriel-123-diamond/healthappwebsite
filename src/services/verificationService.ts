import { auth, storage } from '@/lib/firebase';
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
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();
      const response = await fetch('/api/expert/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licenseNumber,
          documentUrl,
          documentType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit application securely');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting verification application:', error);
      throw error;
    }
  }
};
