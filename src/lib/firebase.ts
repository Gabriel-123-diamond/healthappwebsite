import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAI } from "firebase/ai";
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

// Initialize App Check
let appCheck: any;
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
  // Support manual debug token via env var or automatic debug in localhost
  if (process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN || process.env.NODE_ENV === "development") {
    // @ts-ignore
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN || true;
  }
  
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
    console.log("Firebase App Check initialized successfully");
  } catch (error) {
    console.error("Firebase App Check failed to initialize:", error);
  }
}

export { app, db, auth, vertexAI, appCheck };
