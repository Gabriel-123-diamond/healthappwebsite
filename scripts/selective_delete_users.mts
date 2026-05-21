import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import readline from 'readline';

// 1. Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Force disable emulator
delete process.env.FIRESTORE_EMULATOR_HOST;
delete process.env.FIREBASE_AUTH_EMULATOR_HOST;

// 2. Initialize the Firebase Admin superuser SDK
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    let serviceAccount;
    try {
      const decodedString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_JSON, 'base64').toString('utf-8');
      serviceAccount = JSON.parse(decodedString);
    } catch (e) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    admin.initializeApp();
  }
}

const auth = admin.auth();
const db = admin.firestore();

function createQuestionInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

const askQuestion = (rl: readline.Interface, query: string): Promise<string> => 
  new Promise((resolve) => rl.question(query, resolve));

async function deleteCollection(collectionRef: admin.firestore.CollectionReference) {
  const snapshot = await collectionRef.get();
  for (const doc of snapshot.docs) {
    await deleteDocument(doc.ref);
  }
}

async function deleteDocument(docRef: admin.firestore.DocumentReference) {
  const collections = await docRef.listCollections();
  for (const collection of collections) {
    await deleteCollection(collection);
  }
  await docRef.delete();
}

async function deleteUser(uid: string, email: string | undefined, displayName: string | undefined) {
  process.stdout.write(`Deleting user: ${displayName || 'N/A'} (${email || 'No Email'}) [${uid}]... `);
  
  try {
    const userRef = db.collection('users').doc(uid);
    await deleteDocument(userRef);
    await auth.deleteUser(uid);
    process.stdout.write("✅ Done\n");
    return true;
  } catch (error) {
    process.stdout.write("❌ Failed\n");
    console.error(`  - Detail:`, error);
    return false;
  }
}

async function start() {
  const rl = createQuestionInterface();
  console.log("\n--- Selective User Deletion Script ---");
  
  try {
    const mode = await askQuestion(rl, "Choose mode: [1] Search by name/email [2] List all users [q] Quit: ");

    if (mode === 'q') {
      rl.close();
      process.exit(0);
    }

    let usersToDelete: {uid: string, email?: string, displayName?: string}[] = [];

    if (mode === '1') {
      const query = await askQuestion(rl, "Enter name or email to search for: ");
      const usersSnapshot = await db.collection('users').get();
      
      const matches = usersSnapshot.docs.filter(doc => {
        const data = doc.data();
        const name = (data.fullName || "").toLowerCase();
        const email = (data.email || "").toLowerCase();
        const q = query.toLowerCase();
        return name.includes(q) || email.includes(q);
      });

      if (matches.length === 0) {
        console.log("No users found matching that query.");
        rl.close();
        return start();
      }

      console.log("\nFound users:");
      matches.forEach((doc, index) => {
        const data = doc.data();
        console.log(`[${index + 1}] ${data.fullName || 'No Name'} (${data.email || 'No Email'}) [${doc.id}]`);
      });

      const selection = await askQuestion(rl, "\nEnter numbers to delete (e.g. 1,3) or 'a' for all: ");
      if (selection === 'a') {
        usersToDelete = matches.map(doc => ({
          uid: doc.id, 
          email: doc.data().email, 
          displayName: doc.data().fullName
        }));
      } else {
        const indices = selection.split(',').map(s => parseInt(s.trim()) - 1);
        usersToDelete = indices.filter(i => matches[i]).map(i => ({
          uid: matches[i].id, 
          email: matches[i].data().email, 
          displayName: matches[i].data().fullName
        }));
      }
    } else if (mode === '2') {
      const usersSnapshot = await db.collection('users').limit(50).get();
      if (usersSnapshot.empty) {
        console.log("No users found in database.");
        rl.close();
        return start();
      }

      console.log("\nUsers in database:");
      usersSnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`[${index + 1}] ${data.fullName || 'No Name'} (${data.email || 'No Email'}) [${doc.id}]`);
      });

      const selection = await askQuestion(rl, "\nEnter numbers to delete (e.g. 1,3) or 'a' for all: ");
      if (selection === 'a') {
        usersToDelete = usersSnapshot.docs.map(doc => ({
          uid: doc.id, 
          email: doc.data().email, 
          displayName: doc.data().fullName
        }));
      } else {
        const indices = selection.split(',').map(s => parseInt(s.trim()) - 1);
        usersToDelete = indices.filter(i => usersSnapshot.docs[i]).map(i => ({
          uid: usersSnapshot.docs[i].id, 
          email: usersSnapshot.docs[i].data().email, 
          displayName: usersSnapshot.docs[i].data().fullName
        }));
      }
    }

    if (usersToDelete.length > 0) {
      console.log("\nSelected for deletion:");
      usersToDelete.forEach(u => console.log(` - ${u.displayName} (${u.email})`));

      const confirm = await askQuestion(rl, `\nAre you ABSOLUTELY sure you want to delete these ${usersToDelete.length} users? (yes/no): `);
      
      if (confirm.toLowerCase() === 'yes') {
        for (const user of usersToDelete) {
          await deleteUser(user.uid, user.email, user.displayName);
        }
      } else {
        console.log("Deletion cancelled.");
      }
    } else if (mode !== 'q') {
      console.log("No users selected.");
    }

    rl.close();
    return start();
  } catch (err) {
    console.error("Error during execution:", err);
    rl.close();
    process.exit(1);
  }
}

start();
