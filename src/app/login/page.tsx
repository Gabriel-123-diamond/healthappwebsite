"use client";

import { useAuth } from "@/context/AuthContext";

import { ShieldAlert, ArrowLeft, Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import Link from "next/link";



import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, linkWithCredential, signInWithEmailAndPassword, AuthCredential } from "firebase/auth";

export default function LoginPage() {

  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();

  const router = useRouter();

  

  const [isEmailMode, setIsEmailMode] = useState(false);

  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingCredential, setPendingCredential] = useState<AuthCredential | null>(null);



  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);



  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError("You already have an account with this email using a password. Please log in with your email/password, then connect Google in your Profile settings.");
      } else {
        setError("Google Sign-In failed. Please try again.");
      }
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError(null);

    setIsSubmitting(true);

        try {

          if (isSignUp) {

            await signUpWithEmail(email, password);
            // Effect will handle redirect

          } else {

            await signInWithEmail(email, password);
            // Effect will handle redirect

          }

        } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already in use. If you signed up with Google, please continue with Google.");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError("An account already exists with this email. Please sign in.");
      } else {
        setError(err.message.replace("Firebase: ", ""));
      }
    } finally {

      setIsSubmitting(false);

    }

  };



  if (loading) return null;



  return (

    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100 via-white to-blue-50/30">

      

      {/* Back Button */}

      <Link 

        href="/" 

        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group"

      >

        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-blue-200">

            <ArrowLeft size={18} />

        </div>

        Back to Search

      </Link>



      <motion.div 

        initial={{ opacity: 0, y: 20, scale: 0.95 }}

        animate={{ opacity: 1, y: 0, scale: 1 }}

        transition={{ duration: 0.5, ease: "easeOut" }}

        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-blue-500/10 p-10 text-center border border-white/50 relative overflow-hidden"

      >

        {/* Decorative elements */}

        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50" />

        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-50" />



        <div className="relative z-10 flex flex-col items-center">

            <div className="mb-8 relative">

                <motion.div 

                    initial={{ rotate: -10 }}

                    animate={{ rotate: 0 }}

                    className="p-6 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-[2rem] shadow-xl shadow-blue-200"

                >

                    <ShieldAlert size={40} />

                </motion.div>

                <div className="absolute -top-2 -right-2 p-2 bg-yellow-400 text-white rounded-full shadow-lg border-4 border-white">

                    <Sparkles size={14} />

                </div>

            </div>



            <div className="space-y-3 mb-8">

                <h1 className="text-3xl font-black text-gray-900 tracking-tight">

                    {isEmailMode ? (isSignUp ? "Create Account" : "Welcome Back") : "Personalize Your Health"}

                </h1>

                <p className="text-gray-500 font-medium leading-relaxed">

                    {isEmailMode 

                        ? "Enter your details below." 

                        : "Sign in to save helpful resources, track your history, and access verified medical experts."}

                </p>

            </div>



            {isEmailMode ? (

                <form onSubmit={handleSubmit} className="w-full space-y-4 animate-in fade-in slide-in-from-right-8">

                                        <div className="relative">

                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

                                            <input 

                                                type="email" 

                                                placeholder="Email Address"

                                                className="w-full !bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 transition-all !text-gray-900 placeholder-gray-500 font-semibold"

                                                value={email}

                                                onChange={(e) => setEmail(e.target.value)}

                                                required

                                            />

                                        </div>

                                        <div className="relative">

                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

                                            <input 

                                                type={showPassword ? "text" : "password"}

                                                placeholder="Password"

                                                className="w-full !bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-12 py-3 outline-none focus:border-blue-500 transition-all !text-gray-900 placeholder-gray-500 font-semibold"

                                                value={password}

                                                onChange={(e) => setPassword(e.target.value)}

                                                required

                                                minLength={6}

                                            />

                                            <button

                                                type="button"

                                                onClick={() => setShowPassword(!showPassword)}

                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"

                                            >

                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}

                                            </button>

                                        </div>

                    

                    {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg">{error}</p>}



                    <button

                        type="submit"

                        disabled={isSubmitting}

                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-400"

                    >

                        {isSubmitting ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}

                    </button>

                    

                    <button 

                        type="button"

                        onClick={() => setIsEmailMode(false)}

                        className="text-sm text-gray-400 hover:text-gray-600 underline"

                    >

                        Cancel

                    </button>

                </form>

            ) : (

                <div className="w-full space-y-4">

                    <button

                        onClick={handleGoogleSignIn}

                        disabled={isSubmitting}

                        className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:border-blue-200 hover:bg-blue-50/30 transition-all hover:shadow-lg active:scale-[0.98] disabled:bg-gray-50 disabled:text-gray-400"

                    >

                        {isSubmitting ? (
                            "Connecting..." 
                        ) : (
                            <>
                                <img 
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                                    alt="Google" 
                                    className="w-6 h-6" 
                                />
                                Continue with Google
                            </>
                        )}

                    </button>

                    <button

                        onClick={() => setIsEmailMode(true)}

                        className="w-full flex items-center justify-center gap-4 bg-gray-50 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-[0.98]"

                    >

                        <Mail size={20} />

                        Sign in with Email

                    </button>

                </div>

            )}



                        <div className="mt-12 space-y-4">



                            {isEmailMode && (



                                <p className="text-xs text-gray-500">



                                    {isSignUp ? "Already have an account?" : "Don't have an account?"} 



                                    <button 



                                        onClick={() => setIsSignUp(!isSignUp)}



                                        className="text-blue-600 font-bold ml-1 hover:underline"



                                    >



                                        {isSignUp ? "Sign In" : "Sign Up"}



                                    </button>



                                </p>



                            )}



                            {!isEmailMode && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Educational Purpose Only</p>}



                            



                            <div className="flex justify-center gap-6 text-xs font-bold text-gray-400">



                                <Link href="/legal/terms" className="hover:text-blue-600 transition-colors uppercase tracking-tighter">Terms</Link>



                                <Link href="/legal/privacy" className="hover:text-blue-600 transition-colors uppercase tracking-tighter">Privacy</Link>



                            </div>



                        </div>

        </div>

      </motion.div>

    </div>

  );

}
