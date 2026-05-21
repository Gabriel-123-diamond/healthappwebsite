import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  getRedirectResult,
  linkWithPopup, 
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  signInWithCredential
} from "firebase/auth";
import { auth } from "@/lib/firebase";



export const handleGoogleAuth = async () => {
  const provider = new GoogleAuthProvider();
  // Add some scopes to see if it helps with the popup closing
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  
  try {
    console.log("[AuthService] Initiating Google Auth popup flow with provider:", provider.providerId);
    const result = await signInWithPopup(auth, provider);
    console.log("[AuthService] Popup sign-in successful for user:", result.user.uid);
    return result.user;
  } catch (error: any) {
    console.error("[AuthService] Google Auth Error Details:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
      customData: error.customData
    });
    if (error.code === 'auth/account-exists-with-different-credential') {
      const email = error.customData?.email;
      if (!email) throw error;

      // Logic to handle linking:
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (methods.includes('password')) {
        throw new Error('LINK_REQUIRED:PASSWORD');
      }
    }
    throw error;
  }
};

/**
 * Checks if there's a result from a redirect sign-in
 * Should be called on the auth pages (signin/signup) mount
 */
export const checkRedirectResult = async () => {
  try {
    console.log("[AuthService] Checking for redirect result...");
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("[AuthService] Found redirect result for user:", result.user.uid);
      return result.user;
    }
    console.log("[AuthService] No redirect result found.");
    return null;
  } catch (error: any) {
    console.error("[AuthService] Redirect result error:", error.code, error.message);
    throw error;
  }
};

export const linkAccountsWithPassword = async (password: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No user to link");

  return linkWithPopup(user, new GoogleAuthProvider());
};
