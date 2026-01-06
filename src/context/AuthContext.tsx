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
  // ... existing code ...

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
