"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { verifyAdminPassword } from "@/app/actions/auth";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
        const isValid = await verifyAdminPassword(password);
        if (isValid) {
            onLogin();
        } else {
            setError(true);
        }
    } catch (err) {
        console.error("Auth error", err);
        setError(true);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-gray-900 text-white rounded-2xl">
                <Lock size={32} />
            </div>
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            Global Health <span className="text-blue-600">Admin</span>
        </h1>
        <p className="text-gray-500 mb-8">Enter your secure password to verify identity.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Admin Password" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 transition-all text-gray-900 font-semibold pr-12"
                    value={password}
                    disabled={loading}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError(false);
                    }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm font-medium">Incorrect password.</p>}
            
            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Access Dashboard"}
            </button>
        </form>
      </div>
    </div>
  );
}
