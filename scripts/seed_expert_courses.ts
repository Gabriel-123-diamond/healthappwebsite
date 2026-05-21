import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Configuration for local emulator or production
function getServiceAccount() {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
            const firestoreHost = envContent.match(/FIRESTORE_EMULATOR_HOST="?([^"\n]+)"?/)?.[1];
            const authHost = envContent.match(/FIREBASE_AUTH_EMULATOR_HOST="?([^"\n]+)"?/)?.[1];
            if (firestoreHost) process.env.FIRESTORE_EMULATOR_HOST = firestoreHost;
            if (authHost) process.env.FIREBASE_AUTH_EMULATOR_HOST = authHost;
        }
        const saMatch = envContent.match(/FIREBASE_SERVICE_ACCOUNT_JSON='?({[^'\n]+})'?/);
        if (saMatch) {
            try { return JSON.parse(saMatch[1]); } catch (e) {}
        }
    }
    return null;
}

const serviceAccount = getServiceAccount();

if (!admin.apps.length) {
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.project_id
        });
    } else {
        admin.initializeApp({ projectId: "health-app-dedf4" });
    }
}

const db = admin.firestore();
const auth = admin.auth();

const EXPERT_EMAIL = 'expert2@gmail.com';
const EXPERT_UID = 'expert2-uid-seeder-123';

const COURSES = [
  {
    id: 'course-herbal-first-aid',
    title: 'Mastering Herbal First Aid',
    description: 'Learn how to use common herbs for immediate first aid and minor injuries.',
    category: 'Herbal',
    icon: 'Leaf',
    authorId: EXPERT_UID,
    authorName: 'Expert User',
    status: 'published',
    totalModules: 1,
    modules: [
      {
        id: 'm1',
        title: 'Intro to Herbal First Aid',
        lessons: [
          { 
            id: 'l1', 
            title: 'Why Herbal First Aid?', 
            duration: '5m', 
            type: 'article',
            content: '# Why Herbal First Aid?\n\nHerbal first aid is the practice of using plants and natural substances to provide immediate care.'
          }
        ]
      }
    ]
  }
];

async function seed() {
    console.log("--- Restoring Expert & Clinical Course Data ---");

    // 1. Ensure Expert exists in Auth
    try {
        await auth.createUser({
            uid: EXPERT_UID,
            email: EXPERT_EMAIL,
            password: 'password123',
            displayName: 'Expert User',
            emailVerified: true
        });
    } catch (err: any) {
        if (err.code !== 'auth/uid-already-exists') console.error(err);
    }

    // 2. Create Full Expert Profile (Critical for course creation)
    const userRef = db.collection('users').doc(EXPERT_UID);
    await userRef.set({
        uid: EXPERT_UID,
        email: EXPERT_EMAIL,
        fullName: 'Expert User', // Restored
        firstName: 'Expert',
        lastName: 'User',
        role: 'doctor',
        verificationStatus: 'verified',
        tier: 'premium',
        specialty: 'Internal Medicine',
        onboardingComplete: true,
        profileComplete: true,
        updatedAt: new Date().toISOString()
    }, { merge: true });

    // 3. Clear and Sync Courses
    const learningPathsRef = db.collection('learningPaths');
    const existingPaths = await learningPathsRef.get();
    for (const doc of existingPaths.docs) await doc.ref.delete();

    for (const course of COURSES) {
        await learningPathsRef.doc(course.id).set({
            ...course,
            enrolledCount: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    console.log("--- Seeding Complete. Expert account ready for Studio testing. ---");
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
