export {};

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const { FAQ_DATA_P1 } = require('./faq_data_part1');
const { FAQ_DATA_P2 } = require('./faq_data_part2');

const FAQ_DATA = [...FAQ_DATA_P1, ...FAQ_DATA_P2];

if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    console.log("Using Auth Emulator:", process.env.FIREBASE_AUTH_EMULATOR_HOST);
}

function getServiceAccount() {
    const filePath = path.join(process.cwd(), '..', 'service-account.json');
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
}

const serviceAccount = getServiceAccount();

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount?.project_id || "health-ai-app-77" 
    });
}

const db = admin.firestore();

const categories = [
    'Clinical Intelligence', 'Herbal Wisdom', 'Expert Protocol', 
    'Data Security', 'Network Mesh', 'Account & Billing', 
    'Technical Support', 'Mental Health Node', 'Pediatric Intelligence',
    'Nutritional Neural Base', 'Geriatric Protocol', 'Emergency Diagnostic'
];

for (let i = 1; i <= 150; i++) {
    const cat = categories[i % categories.length];
    FAQ_DATA.push({
        id: `node-ext-${i}`,
        category: cat,
        question: `Protocol Node ${i}: How do I optimize ${cat} efficiency?`,
        answer: `This intelligence node provides specialized diagnostics for ${cat}. System performance is optimized through periodic neural synchronization and localized data caching.`,
        solution: `If you encounter diagnostic latency in ${cat}, perform a hard reset of your local interface settings.`,
        actionLabel: 'Sync Node',
        actionHref: '/support'
    });
}

async function seed() {
    console.log("--- Initializing Expanded FAQ Seeding Protocol ---");
    const collectionRef = db.collection('faqs');
    const existing = await collectionRef.get();
    console.log(`Clearing ${existing.size} existing entries...`);
    
    let clearBatch = db.batch();
    let clearCount = 0;
    for (const doc of existing.docs) {
        clearBatch.delete(doc.ref);
        clearCount++;
        if (clearCount === 450) {
            await clearBatch.commit();
            clearBatch = db.batch();
            clearCount = 0;
        }
    }
    if (clearCount > 0) await clearBatch.commit();

    console.log(`Injecting ${FAQ_DATA.length} new intelligence nodes...`);
    let batch = db.batch();
    let count = 0;
    for (const faq of FAQ_DATA) {
        const ref = collectionRef.doc(faq.id);
        batch.set(ref, {
            ...faq,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        count++;
        if (count === 450) {
            await batch.commit();
            batch = db.batch();
            count = 0;
        }
    }
    if (count > 0) await batch.commit();
    console.log(`--- FAQ Seeding Complete. ${FAQ_DATA.length} Intelligence Nodes Operational. ---`);
    process.exit(0);
}

seed().catch(err => {
    console.error("Seeding Failed:", err);
    process.exit(1);
});
