/**
 * Firebase Firestore Role/Type Migration Script
 * Migrates all 'herbal_practitioner' values in users, experts, and requests collections to 'wellness_practitioner'.
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if present
try {
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
} catch (e) {
  // dotenv might not be installed, proceed anyway
}

// Determine if we should use local emulator
const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' || process.env.FIRESTORE_EMULATOR_HOST !== undefined;

if (useEmulator) {
  process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
  console.log(">>> Connecting to local Firestore emulator at:", process.env.FIRESTORE_EMULATOR_HOST);
}

// Load service account from root directory
let serviceAccount = null;
const serviceAccountPath = path.join(__dirname, '..', '..', 'service-account.json');

if (fs.existsSync(serviceAccountPath)) {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  console.log(">>> Loaded service account from:", serviceAccountPath);
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
  } else if (useEmulator) {
    // Emulator fallback with demo project
    admin.initializeApp({ projectId: 'health-app-dedf4' });
  } else {
    console.error("CRITICAL: No service-account.json found and not in emulator mode!");
    process.exit(1);
  }
}

const db = admin.firestore();

async function migrate() {
  console.log("Starting database migration: herbal_practitioner -> wellness_practitioner...");

  let usersMigrated = 0;
  let expertsMigrated = 0;
  let requestsMigrated = 0;

  // 1. Migrate Users role
  const usersSnapshot = await db.collection('users')
    .where('role', '==', 'herbal_practitioner')
    .get();

  console.log(`Found ${usersSnapshot.size} users with role 'herbal_practitioner'.`);
  if (usersSnapshot.size > 0) {
    const userBatch = db.batch();
    usersSnapshot.forEach(doc => {
      userBatch.update(doc.ref, { 
        role: 'wellness_practitioner',
        updatedAt: new Date().toISOString()
      });
      usersMigrated++;
    });
    await userBatch.commit();
    console.log(`Successfully migrated ${usersMigrated} users.`);
  }

  // 2. Migrate Experts type
  const expertsSnapshot = await db.collection('experts')
    .where('type', '==', 'herbal_practitioner')
    .get();

  console.log(`Found ${expertsSnapshot.size} experts with type 'herbal_practitioner'.`);
  if (expertsSnapshot.size > 0) {
    const expertBatch = db.batch();
    expertsSnapshot.forEach(doc => {
      expertBatch.update(doc.ref, { 
        type: 'wellness_practitioner',
        updatedAt: new Date().toISOString()
      });
      expertsMigrated++;
    });
    await expertBatch.commit();
    console.log(`Successfully migrated ${expertsMigrated} experts.`);
  }

  // 3. Migrate Expert Requests role/type
  const requestsSnapshot = await db.collection('expert_requests')
    .where('role', '==', 'herbal_practitioner')
    .get();

  console.log(`Found ${requestsSnapshot.size} requests with role 'herbal_practitioner'.`);
  if (requestsSnapshot.size > 0) {
    const requestBatch = db.batch();
    requestsSnapshot.forEach(doc => {
      requestBatch.update(doc.ref, { 
        role: 'wellness_practitioner',
        updatedAt: new Date().toISOString()
      });
      requestsMigrated++;
    });
    await requestBatch.commit();
    console.log(`Successfully migrated ${requestsMigrated} requests.`);
  }

  console.log("Migration complete!");
  console.log(`Summary: Users: ${usersMigrated}, Experts: ${expertsMigrated}, Requests: ${requestsMigrated}`);
}

migrate()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
