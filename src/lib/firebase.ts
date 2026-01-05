import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

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

// Initialize App Check (Client-side only)
if (typeof window !== "undefined") {
    // Enable debug token in development mode
    if (process.env.NODE_ENV === 'development') {
        (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
        console.log("App Check Debug Token enabled. Check console for the token.");
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey) {
        initializeAppCheck(app, {
            provider: new ReCaptchaEnterpriseProvider(siteKey),
            isTokenAutoRefreshEnabled: true,
        });
    }
}

// Initialize Firestore with persistent cache settings (Fixes deprecation warning)
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
});

const auth = getAuth(app);

const storage = getStorage(app);

let messaging = null;

if (typeof window !== "undefined") {
    try {
        messaging = getMessaging(app);
    } catch (err) {
        console.warn("Firebase Messaging failed to initialize:", err);
    }
}



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

    
