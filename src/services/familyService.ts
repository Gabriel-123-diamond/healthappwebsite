import { db, auth } from '@/lib/firebase';
import { 
  collection, doc, getDoc, updateDoc, arrayUnion, 
  arrayRemove, query, where, getDocs, addDoc, serverTimestamp 
} from 'firebase/firestore';
import { UserProfile } from '@/types';

export interface FamilyInvite {
  id?: string;
  senderId: string;
  senderName: string;
  receiverEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
}

export const familyService = {
  /**
   * Sends an invitation to a family member.
   */
  sendInvite: async (email: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    // 1. Check if user has available slots
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data() as UserProfile;
    
    const currentMembers = userData.familyMembers?.length || 0;
    const slots = userData.familySlots || 0;

    if (currentMembers >= slots) {
      throw new Error("No available family slots. Upgrade to ELITE for more.");
    }

    // 2. Create invite record
    const inviteData: Omit<FamilyInvite, 'id'> = {
      senderId: user.uid,
      senderName: userData.fullName,
      receiverEmail: email.toLowerCase().trim(),
      status: 'pending',
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, 'family_invites'), inviteData);
  },

  /**
   * Accepts a family invitation.
   */
  acceptInvite: async (inviteId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    const inviteRef = doc(db, 'family_invites', inviteId);
    const inviteSnap = await getDoc(inviteRef);
    
    if (!inviteSnap.exists()) throw new Error("Invite not found");
    const inviteData = inviteSnap.data() as FamilyInvite;

    // Update Sender's family list
    await updateDoc(doc(db, 'users', inviteData.senderId), {
      familyMembers: arrayUnion(user.uid)
    });

    // Update Receiver's (current user) family list
    await updateDoc(doc(db, 'users', user.uid), {
      familyMembers: arrayUnion(inviteData.senderId)
    });

    // Mark invite as accepted
    await updateDoc(inviteRef, { status: 'accepted' });
  },

  /**
   * Removes a family member.
   */
  removeMember: async (memberUid: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    // Remove from current user
    await updateDoc(doc(db, 'users', user.uid), {
      familyMembers: arrayRemove(memberUid)
    });

    // Remove current user from member's list
    await updateDoc(doc(db, 'users', memberUid), {
      familyMembers: arrayRemove(user.uid)
    });
  },

  /**
   * Fetches family members' profiles.
   */
  getFamilyMembers: async (): Promise<UserProfile[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const uids = (userDoc.data() as UserProfile).familyMembers || [];

    if (uids.length === 0) return [];

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', 'in', uids));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data() as UserProfile);
  }
};
