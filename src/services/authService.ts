import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  linkWithPopup, 
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  signInWithCredential
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export const handleGoogleAuth = async () => {
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/account-exists-with-different-credential') {
      const email = error.customData?.email;
      if (!email) throw error;

      // Logic to handle linking:
      // 1. Fetch sign-in methods for this email
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (methods.includes('password')) {
        // In a real app, you would show a dialog asking for password
        // to link the accounts. For this implementation, we'll throw 
        // a specific error that the UI can catch to show the linking flow.
        throw new Error('LINK_REQUIRED:PASSWORD');
      }
    }
    throw error;
  }
};

export const linkAccountsWithPassword = async (password: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No user to link");

  const credential = EmailAuthProvider.credential(user.email, password);
  return linkWithPopup(user, new GoogleAuthProvider());
};
