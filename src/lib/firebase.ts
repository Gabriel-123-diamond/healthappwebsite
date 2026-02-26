import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAI } from "firebase/ai";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const vertexAI = getAI(app);
const storage = getStorage(app);

// Initialize App Check
let appCheck: any;
if (typeof window !== "undefined") {
  // Prevent double initialization in Next.js HMR/Hydration
  try {
    const isDebug = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN === 'true' || process.env.NODE_ENV === "development";
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (isDebug) {
      // @ts-ignore
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN || true;
    }
    
    if (siteKey) {
      // ReCaptchaEnterpriseProvider is for Enterprise keys. 
      // If you use a standard v3 key, use ReCaptchaV3Provider instead.
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
      if (isDebug) console.log("Firebase App Check initialized.");
    }
  } catch (error) {
    // If it's already initialized, we can ignore the error
    if (process.env.NODE_ENV === "development") {
      console.warn("App Check initialization skipped (likely already initialized):", error);
    }
  }
}

export { app, db, auth, vertexAI, storage, appCheck };
