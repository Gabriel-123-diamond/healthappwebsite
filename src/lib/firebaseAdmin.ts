import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

if (typeof window !== 'undefined') {
  throw new Error('firebaseAdmin.ts can only be imported on the server.');
}

const useEmulator = String(process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR) === "true";

// Ensure emulator environment variables are recognized if present
if (useEmulator) {
  // MUST SET THESE BEFORE admin.auth() or admin.firestore() are accessed
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = "127.0.0.1:9199";
  
  // Disable SSL for local emulator communication
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  
  console.log(">>> [ADMIN SDK] Local Emulator Mode ACTIVE");
  console.log(">>> Auth:", process.env.FIREBASE_AUTH_EMULATOR_HOST);
  console.log(">>> Firestore:", process.env.FIRESTORE_EMULATOR_HOST);
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
    const projectId = serviceAccount.project_id || serviceAccount.projectId;
    
    // Set project ID environment variables for the SDK
    process.env.GCLOUD_PROJECT = projectId;
    process.env.FIREBASE_PROJECT_ID = projectId;
    
    if (useEmulator) {
      console.log(">>> [ADMIN SDK] Initializing for Project:", projectId, " (EMULATOR)");
    } else {
      console.log(">>> [ADMIN SDK] Initializing for Project:", projectId, " (PRODUCTION)");
    }

    try {
      admin.initializeApp({
        projectId: projectId,
        credential: admin.credential.cert({
          projectId: projectId,
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
export const adminMessaging = admin.messaging();
