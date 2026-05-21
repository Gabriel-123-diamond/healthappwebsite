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

/**
 * Removes undefined fields from an object to prevent Firestore errors.
 * Useful for spreading objects that may have optional undefined fields.
 */
export function cleanUndefined(obj: any): any {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    } else if (newObj[key] !== null && typeof newObj[key] === 'object' && !newObj[key].hasOwnProperty('converter')) {
      // Basic check to avoid recursing into Firestore complex types if needed, 
      // but for most spread data it should be fine.
    }
  });
  return newObj;
}
