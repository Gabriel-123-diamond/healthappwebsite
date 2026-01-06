"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, 
  signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  linkWithPopup, unlink
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { requestNotificationPermission } from "@/lib/notifications";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  linkGoogle: () => Promise<void>;
  unlinkGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  linkGoogle: async () => {},
  unlinkGoogle: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        requestNotificationPermission();
        
        const checkProfile = async (retries = 10) => {
          try {
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists() && pathname !== "/profile-setup") {
               console.log("Profile missing, redirecting to setup...");
               router.push("/profile-setup");
            }
          } catch (e: any) {
            // If permission denied (likely App Check not ready), retry
            if (retries > 0 && (e.code === 'permission-denied' || e.message?.includes('permission'))) {
              console.warn(`Profile check failed (permission). Retrying in 1s... (${retries} left)`);
              await new Promise(res => setTimeout(res, 1000));
              return checkProfile(retries - 1);
            }
            console.error("Error checking profile (final):", e);
            // Fallback: If we can't check profile, assume valid or let dashboard handle it.
            // This prevents being stuck on login page.
            if (pathname === "/login") {
                router.push("/");
            }
          }
        };

        checkProfile();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [pathname]); // Re-run check on path change to ensure protection

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Failed:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const linkGoogle = async () => {
    if (!auth.currentUser) return;
    try {
        const provider = new GoogleAuthProvider();
        await linkWithPopup(auth.currentUser, provider);
    } catch (error) {
        console.error("Link Google Failed:", error);
        throw error;
    }
  };

  const unlinkGoogle = async () => {
    if (!auth.currentUser) return;
    try {
        await unlink(auth.currentUser, GoogleAuthProvider.PROVIDER_ID);
    } catch (error) {
        console.error("Unlink Google Failed:", error);
        throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, linkGoogle, unlinkGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);