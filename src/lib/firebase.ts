import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase (Singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

if (typeof window !== "undefined") {
    enableMultiTabIndexedDbPersistence(db).catch((err) => {
        console.warn("Persistence error:", err.code);
    });
}

const auth = getAuth(app);

const storage = getStorage(app);

const messaging = typeof window !== "undefined" ? getMessaging(app) : null;



// Initialize Vertex AI for Firebase (Client-side only)



let model: any = null;



if (typeof window !== "undefined") {

    try {

        const ai = getAI(app, {

            backend: new VertexAIBackend()

                });

                model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

            } catch (error) {

        

        console.error("Vertex AI Initialization Failed:", error);

        }

    }

    

    export { app, db, auth, storage, model, messaging };

    
