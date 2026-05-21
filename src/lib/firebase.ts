import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAI } from "firebase/ai";
import { getStorage, connectStorageEmulator } from "firebase/storage";
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

// Connect to Local Emulators
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  console.log("Connected to Local Firebase Auth, Firestore and Storage Emulators");
}

// Initialize App Check
let appCheck: any;
if (typeof window !== "undefined") {
  // Prevent double initialization in Next.js HMR/Hydration
  try {
    const debugToken = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN;
    const isDebug = debugToken || process.env.NODE_ENV === "development";
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (debugToken && debugToken !== 'false') {
      // @ts-ignore
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
    } else if (process.env.NODE_ENV === "development") {
      // @ts-ignore
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
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
