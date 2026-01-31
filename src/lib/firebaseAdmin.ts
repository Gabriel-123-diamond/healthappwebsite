import * as admin from 'firebase-admin';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccountJson) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not defined");
}

let serviceAccount;
try {
  // Remove potential surrounding quotes from environment variable string
  const cleanedJson = serviceAccountJson.trim().replace(/^['"]|['"]$/g, '');
  serviceAccount = JSON.parse(cleanedJson);
  
  // Ensure the private key handles newlines correctly
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} catch (e) {
  throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
