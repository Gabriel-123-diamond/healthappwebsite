import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

export async function POST() {
  try {
    // Seed Experts
    const experts = [
      { name: 'Dr. Sarah Johnson', specialty: 'Cardiology', verified: true, location: 'New York, USA' },
      { name: 'Ayush Gupta', specialty: 'Ayurveda', verified: true, location: 'Kerala, India' },
      { name: 'Dr. Emily Stone', specialty: 'General Practice', verified: false, location: 'London, UK' },
    ];

    for (const expert of experts) {
      await addDoc(collection(db, 'experts'), expert);
    }

    // Seed Articles
    const articles = [
      {
        title: 'The Role of Curcumin in Chronic Inflammation',
        category: 'Herbal',
        evidenceGrade: 'A',
        summary: 'Extensive research highlights the potent anti-inflammatory properties of turmeric-derived curcumin.',
        date: 'Jan 24, 2026'
      },
      {
        title: 'Hypertension: Standard Medical Protocols',
        category: 'Medical',
        evidenceGrade: 'A',
        summary: 'A summary of the current guidelines for managing high blood pressure.',
        date: 'Jan 20, 2026'
      }
    ];

    for (const article of articles) {
      await addDoc(collection(db, 'articles'), article);
    }

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
