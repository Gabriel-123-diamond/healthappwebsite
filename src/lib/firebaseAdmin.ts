import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

if (typeof window !== 'undefined') {
  throw new Error('firebaseAdmin.ts can only be imported on the server.');
}

/**
 * Robustly parses the Firebase Service Account configuration.
 * Supports:
 * 1. Base64 encoded JSON (most secure for env vars)
 * 2. Raw stringified JSON
 * 3. Fallback to local service-account.json file
 */
function getServiceAccount() {
  const envValue = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (envValue) {
    try {
      const trimmed = envValue.trim().replace(/^['"]|['"]$/g, '');
      
      // Try to detect if it's base64 (no curly braces, usually ends with = or just alphanumeric)
      let jsonString = trimmed;
      if (!trimmed.startsWith('{') && !trimmed.includes('\n')) {
        try {
          jsonString = Buffer.from(trimmed, 'base64').toString('utf8');
        } catch (e) {
          // Not base64, proceed as raw string
        }
      }

      const config = JSON.parse(jsonString);
      
      // Fix private key newlines if they are escaped as \n
      if (config.private_key && typeof config.private_key === 'string') {
        config.private_key = config.private_key.replace(/\\n/g, '\n');
      }
      
      return config;
    } catch (e) {
      console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_JSON from environment:", e);
    }
  }

  // Fallback to local file for development
  try {
    const filePath = path.join(process.cwd(), '..', 'service-account.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    console.error("Error reading service-account.json file fallback:", e);
  }

  return null;
}

if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();

  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: serviceAccount.project_id || serviceAccount.projectId,
          clientEmail: serviceAccount.client_email || serviceAccount.clientEmail,
          privateKey: serviceAccount.private_key,
        }),
      });
    } catch (e) {
      console.error("Firebase Admin initializeApp failed:", e);
      throw e;
    }
  } else {
    throw new Error("No Firebase Service Account configuration found (env or file)");
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
