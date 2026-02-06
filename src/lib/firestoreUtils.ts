import { db, auth } from './firebase';
import { collection, doc, CollectionReference, DocumentReference } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from './constants';

/**
 * Shared utility to get a reference to a subcollection under the current user.
 */
export function getUserSubcollection(subcollectionName: string): CollectionReference | null {
  const user = auth.currentUser;
  if (!user) return null;
  return collection(db, FIRESTORE_COLLECTIONS.USERS, user.uid, subcollectionName);
}

/**
 * Shared utility to get a reference to a document within a user's subcollection.
 */
export function getUserSubdoc(subcollectionName: string, docId: string): DocumentReference | null {
  const user = auth.currentUser;
  if (!user) return null;
  return doc(db, FIRESTORE_COLLECTIONS.USERS, user.uid, subcollectionName, docId);
}
