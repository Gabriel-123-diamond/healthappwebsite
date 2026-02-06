import * as admin from 'firebase-admin';
import { geohashForLocation } from 'geofire-common';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') }); // Adjusted path to be relative to scripts/

// Manually initialize Admin App if not already done (copied logic to be standalone)
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccountJson) {
  console.error("FIREBASE_SERVICE_ACCOUNT_JSON is not defined in .env.local");
  process.exit(1);
}

let serviceAccount;
try {
  let cleanedJson = serviceAccountJson.trim();
  if (cleanedJson.startsWith("'") && cleanedJson.endsWith("'")) {
      cleanedJson = cleanedJson.slice(1, -1);
  } else if (cleanedJson.startsWith('"') && cleanedJson.endsWith('"')) {
      cleanedJson = cleanedJson.slice(1, -1);
  }
  
  serviceAccount = JSON.parse(cleanedJson);
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} catch (e) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON", e);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const FEED_DATA = {
  en: [
    {
      id: '1',
      title: 'New Study: The Effects of Turmeric on Inflammation',
      excerpt: 'A randomized control trial shows promising results for curcumin supplements in reducing joint pain.',
      type: 'article',
      category: 'Herbal',
      source: 'Journal of Natural Medicine',
      date: 'Jan 24, 2026',
      isVerified: true,
      link: '/article/1',
      evidenceGrade: 'B'
    },
    {
      id: '2',
      title: 'Understanding Type 2 Diabetes Management',
      excerpt: 'Dr. Sarah Smith explains the latest guidelines on diet and medication for T2D.',
      type: 'video',
      category: 'Medical',
      source: 'Ikiké Health AI Network',
      date: 'Jan 23, 2026',
      isVerified: true,
      link: '#',
      evidenceGrade: 'A'
    },
    {
      id: '3',
      title: '5 Minute Morning Yoga Routine',
      excerpt: 'Start your day with these simple stretches to improve circulation and reduce stress.',
      type: 'video',
      category: 'Lifestyle',
      source: 'Wellness Daily',
      date: 'Jan 22, 2026',
      isVerified: false,
      link: '#',
      evidenceGrade: 'C'
    },
    {
      id: '4',
      title: 'Antibiotic Resistance: What You Need to Know',
      excerpt: 'Why overuse of antibiotics is a global health threat and how to prevent it.',
      type: 'article',
      category: 'Medical',
      source: 'World Health Org',
      date: 'Jan 20, 2026',
      isVerified: true,
      link: '/article/2',
      evidenceGrade: 'A'
    }
  ]
};

// ... (Feed items kept for reference if needed, but defining EXPERT_DATA here)
const EXPERT_DATA = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    type: 'doctor',
    specialty: 'Cardiologist',
    location: 'New York, NY, USA',
    rating: 4.9,
    verified: true,
    lat: 40.7128,
    lng: -74.0060
  },
  {
    id: '2',
    name: 'Green Leaf Wellness',
    type: 'herbalist',
    specialty: 'Traditional Chinese Medicine',
    location: 'San Francisco, CA, USA',
    rating: 4.8,
    verified: true,
    lat: 37.7749,
    lng: -122.4194
  },
  {
    id: '3',
    name: 'General City Hospital',
    type: 'hospital',
    specialty: 'Emergency & Trauma',
    location: 'Chicago, IL, USA',
    rating: 4.5,
    verified: true,
    lat: 41.8781,
    lng: -87.6298
  },
  {
    id: '4',
    name: 'Dr. Chioma Okeke',
    type: 'doctor',
    specialty: 'Pediatrician',
    location: 'Lagos, Nigeria',
    rating: 4.9,
    verified: true,
    lat: 6.5244,
    lng: 3.3792
  },
  {
    id: '5',
    name: 'Royal London Hospital',
    type: 'hospital',
    specialty: 'General Medicine',
    location: 'London, UK',
    rating: 4.7,
    verified: true,
    lat: 51.5074,
    lng: -0.1278
  },
  {
    id: '6',
    name: 'Dr. Wei Zhang',
    type: 'doctor',
    specialty: 'Neurologist',
    location: 'Beijing, China',
    rating: 4.8,
    verified: true,
    lat: 39.9042,
    lng: 116.4074
  },
  {
    id: '7',
    name: 'Mumbai Heart Institute',
    type: 'hospital',
    specialty: 'Cardiology',
    location: 'Mumbai, India',
    rating: 4.9,
    verified: true,
    lat: 19.0760,
    lng: 72.8777
  },
  {
    id: '8',
    name: 'Dr. Ana Silva',
    type: 'doctor',
    specialty: 'Dermatologist',
    location: 'Sao Paulo, Brazil',
    rating: 4.8,
    verified: true,
    lat: -23.5505,
    lng: -46.6333
  },
  {
    id: '9',
    name: 'Berlin Naturheilpraxis',
    type: 'herbalist',
    specialty: 'Homeopathy',
    location: 'Berlin, Germany',
    rating: 4.6,
    verified: true,
    lat: 52.5200,
    lng: 13.4050
  },
  {
    id: '10',
    name: 'Dr. Yuki Tanaka',
    type: 'doctor',
    specialty: 'Ophthalmologist',
    location: 'Tokyo, Japan',
    rating: 4.9,
    verified: true,
    lat: 35.6762,
    lng: 139.6503
  },
  {
    id: '11',
    name: 'Nairobi Wellness Centre',
    type: 'doctor',
    specialty: 'General Practitioner',
    location: 'Nairobi, Kenya',
    rating: 4.5,
    verified: true,
    lat: -1.2921,
    lng: 36.8219
  },
  {
    id: '12',
    name: 'Paris Vision Clinic',
    type: 'doctor',
    specialty: 'Ophthalmologist',
    location: 'Paris, France',
    rating: 4.8,
    verified: true,
    lat: 48.8566,
    lng: 2.3522
  },
  {
    id: '13',
    name: 'Sydney Dental Care',
    type: 'doctor',
    specialty: 'Dentist',
    location: 'Sydney, Australia',
    rating: 4.7,
    verified: true,
    lat: -33.8688,
    lng: 151.2093
  },
  {
    id: '14',
    name: 'Cairo Medical Specialists',
    type: 'doctor',
    specialty: 'Internal Medicine',
    location: 'Cairo, Egypt',
    rating: 4.6,
    verified: true,
    lat: 30.0444,
    lng: 31.2357
  },
  {
    id: '15',
    name: 'Toronto Holistic Health',
    type: 'herbalist',
    specialty: 'Naturopathy',
    location: 'Toronto, Canada',
    rating: 4.8,
    verified: true,
    lat: 43.6510,
    lng: -79.3470
  }
];

const LEARNING_PATHS_DATA = [
  {
    id: '1',
    title: 'Managing Hypertension',
    description: 'Learn the basics of high blood pressure, medication management, and lifestyle changes.',
    category: 'Medical',
    icon: 'Activity',
    progress: 35,
    totalModules: 3,
    modules: [
      {
        id: 'm1',
        title: 'Understanding Blood Pressure',
        lessons: [
          { id: 'l1', title: 'What is Systolic vs Diastolic?', duration: '3 min', type: 'video', isCompleted: true },
          { id: 'l2', title: 'The Silent Killer: Symptoms', duration: '5 min', type: 'article', isCompleted: false },
        ]
      },
      {
        id: 'm2',
        title: 'Dietary Changes',
        lessons: [
          { id: 'l3', title: 'The DASH Diet Explained', duration: '10 min', type: 'article', isCompleted: false },
          { id: 'l4', title: 'Reducing Sodium Intake', duration: '4 min', type: 'video', isCompleted: false },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Herbal Remedies 101',
    description: 'A beginner’s guide to safe and effective herbal teas, tinctures, and salves.',
    category: 'Herbal',
    icon: 'Leaf',
    progress: 0,
    totalModules: 4,
    modules: []
  },
  {
    id: '3',
    title: 'Sleep Hygiene Masterclass',
    description: 'Practical steps to improve your sleep quality naturally.',
    category: 'Lifestyle',
    icon: 'Moon',
    progress: 80,
    totalModules: 2,
    modules: []
  }
];

const QUESTIONS_DATA = [
  {
    id: '1',
    title: 'Safe herbal teas for pregnancy?',
    content: 'I am in my second trimester and looking for safe herbal teas to help with digestion and sleep. Any recommendations?',
    authorName: 'Sarah J.',
    category: 'Herbal',
    timestamp: '2 hours ago', // Note: Ideally use real timestamps
    likes: 12,
    answerCount: 2,
    tags: ['Pregnancy', 'Herbal Tea', 'Digestion'],
    isResolved: true,
    answers: [
      {
        id: 'a1',
        authorName: 'Dr. Emily Chen',
        authorRole: 'Expert',
        isVerifiedExpert: true,
        content: 'Ginger and Peppermint teas are generally considered safe and helpful for digestion. Chamomile is also good for sleep, but always consult your OBGYN first.',
        timestamp: '1 hour ago',
        likes: 45
      },
      {
        id: 'a2',
        authorName: 'Maria R.',
        authorRole: 'User',
        isVerifiedExpert: false,
        content: 'I used Lemon Balm tea and it worked wonders!',
        timestamp: '30 mins ago',
        likes: 3
      }
    ]
  },
  {
    id: '2',
    title: 'Intermittent Fasting and Blood Sugar',
    content: 'Can intermittent fasting help regulate blood sugar levels for pre-diabetics?',
    authorName: 'Mike T.',
    category: 'Medical',
    timestamp: '5 hours ago',
    likes: 34,
    answerCount: 1,
    tags: ['Diabetes', 'Diet', 'Fasting'],
    isResolved: false,
    answers: [
      {
        id: 'a3',
        authorName: 'Nutritionist Lisa',
        authorRole: 'Expert',
        isVerifiedExpert: true,
        content: 'Some studies suggest it can improve insulin sensitivity, but it is crucial to monitor your levels closely. It is not suitable for everyone.',
        timestamp: '3 hours ago',
        likes: 20
      }
    ]
  },
  {
    id: '3',
    title: 'Best exercises for lower back pain?',
    content: 'I sit at a desk all day and have chronic lower back pain. What exercises can I do at home?',
    authorName: 'Alex W.',
    category: 'Lifestyle',
    timestamp: '1 day ago',
    likes: 8,
    answerCount: 0,
    tags: ['Fitness', 'Back Pain', 'Ergonomics'],
    isResolved: false,
    answers: []
  }
];

const EXPERT_STATS_DATA = {
  expertId: '1', // Dr. Sarah Johnson
  totalViews: 12500,
  questionsAnswered: 45,
  articlesPublished: 8,
  rating: 4.8
};

const EXPERT_CONTENT_DATA = [
  { id: '1', expertId: '1', title: 'Managing Diabetes with Diet', type: 'Article', status: 'Published', views: 5400, date: 'Jan 15, 2026' },
  { id: '2', expertId: '1', title: 'Yoga for Back Pain', type: 'Video', status: 'Published', views: 3200, date: 'Jan 10, 2026' },
  { id: '3', expertId: '1', title: 'Understanding Herbal Teas', type: 'Article', status: 'Draft', views: 0, date: 'Jan 26, 2026' },
];

async function seed() {
  console.log("Starting seed process...");

  const batch = db.batch();

  // Seed Experts
  console.log("Seeding Experts...");
  for (const expert of EXPERT_DATA) {
    const docRef = db.collection('experts').doc(expert.id);
    const hash = geohashForLocation([expert.lat, expert.lng]);
    
    batch.set(docRef, {
      ...expert,
      geohash: hash,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // Seed Learning Paths
  console.log("Seeding Learning Paths...");
  for (const path of LEARNING_PATHS_DATA) {
    const docRef = db.collection('learningPaths').doc(path.id);
    batch.set(docRef, {
      ...path,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // Seed Questions
  console.log("Seeding Questions...");
  for (const q of QUESTIONS_DATA) {
    const docRef = db.collection('questions').doc(q.id);
    batch.set(docRef, {
      ...q,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      // Converting string timestamp to real date if possible, otherwise keeping string for now as it's just a seed
      timestamp: q.timestamp 
    });
  }

  // Seed Expert Stats & Content
  console.log("Seeding Expert Dashboard Data...");
  const statsRef = db.collection('expert_stats').doc(EXPERT_STATS_DATA.expertId);
  batch.set(statsRef, EXPERT_STATS_DATA);

  for (const content of EXPERT_CONTENT_DATA) {
    const contentRef = db.collection('expert_content').doc(content.id);
    batch.set(contentRef, content);
  }

  // Seed Safety Config
  console.log("Seeding Safety Config...");
  const safetyRef = db.collection('safety_config').doc('default');
  batch.set(safetyRef, {
    crisisKeywords: ['suicide', 'self-harm', 'kill', 'die', 'end my life'],
    emergencyKeywords: ['poison', 'overdose', 'heart attack', 'stroke', 'difficulty breathing'],
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Seed Feed Items
  console.log("Seeding Feed Items...");
  // We will store them in a 'feed_items' collection. 
  // Since we have multi-language in the mock, for Firestore simplicity in this MVP, 
  // I'll just seed the English ones and add a 'language' field = 'en'.
  // Ideally, you'd have localized subcollections or fields.
  
  const feedItems = FEED_DATA.en;
  
  for (const item of feedItems) {
    const docRef = db.collection('feed_items').doc(item.id); // Use ID from data to avoid dupes on re-run
    batch.set(docRef, {
        ...item,
        language: 'en',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  await batch.commit();
  console.log(`Seeded ${feedItems.length} feed items and ${EXPERT_DATA.length} experts.`);
}

seed()
  .then(() => {
    console.log("Seeding complete.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });