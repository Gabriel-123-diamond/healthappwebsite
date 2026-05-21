import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

// 1. Load the active Development/Production environment nodes
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// 2. Initialize the Firebase Admin superuser SDK
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    let serviceAccount;
    try {
      const decodedString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_JSON, 'base64').toString('utf-8');
      serviceAccount = JSON.parse(decodedString);
    } catch (e) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    // Fallback if running via exact Google Cloud contexts
    admin.initializeApp();
  }
}

const auth = admin.auth();
const db = admin.firestore();

async function executeFirebaseTeardown() {
  console.warn("\\n=======================================================");
  console.warn("⚠️  WARNING: INITIATING COMPLETE FIREBASE DATA WIPE ⚠️");
  console.warn("=======================================================\\n");

  try {
    // ---------------------------------------------------------
    // STEP 1: WIPE FIREBASE AUTHENTICATION (The Login Gateway)
    // ---------------------------------------------------------
    console.log("[1/2] Fetching Firebase Auth arrays...");
    let nextPageToken: string | undefined;
    let authDeletedCount = 0;

    do {
      // Fetch users in chunks of 1000 (Firebase Admin maximum)
      const listUsersResult = await auth.listUsers(1000, nextPageToken);
      const uids = listUsersResult.users.map((userRecord) => userRecord.uid);

      if (uids.length > 0) {
        // Issue mass deletion payload
        const deleteResult = await auth.deleteUsers(uids);
        authDeletedCount += deleteResult.successCount;
        console.log(` -> Eradicated ${authDeletedCount} Auth profiles...`);
      }

      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    console.log(`✅ SUCCESS: Permanently wiped ${authDeletedCount} accounts from Firebase Authentication.\n`);


    // ---------------------------------------------------------
    // STEP 2: WIPE FIRESTORE USERS DB (The NoSQL Storage Schema)
    // ---------------------------------------------------------
    console.log("[2/2] Connecting to NoSQL 'users' collection...");
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log("✅ SUCCESS: The 'users' Firestore collection is already empty.\n");
    } else {
      let firestoreDeletedCount = 0;
      const batchArray: admin.firestore.WriteBatch[] = [];
      batchArray.push(db.batch());
      
      let operationCounter = 0;
      let batchIndex = 0;

      // Firestore physical transaction batches are violently limited to 500 mutations.
      // We will slice the workload into arrays of 490 to execute without cloud rate-limits.
      snapshot.docs.forEach((doc) => {
        batchArray[batchIndex].delete(doc.ref);
        operationCounter++;
        firestoreDeletedCount++;

        if (operationCounter === 490) {
          batchArray.push(db.batch());
          batchIndex++;
          operationCounter = 0;
        }
      });

      // Execute the multi-batch destruction payloads
      console.log(` -> Dispatching ${batchArray.length} asynchronous write batches to Google Server...`);
      for (const batch of batchArray) {
        await batch.commit();
      }

      console.log(`✅ SUCCESS: Permanently wiped ${firestoreDeletedCount} NoSQL documents from Firestore.\n`);
    }

    console.log("🔥 TEARDOWN COMPLETE 🔥\n");

  } catch (error) {
    console.error("❌ Fatal Error executing Teardown Pipeline:", error);
  }
}

// Trigger the Engine
executeFirebaseTeardown();
