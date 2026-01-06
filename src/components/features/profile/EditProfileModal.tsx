"use client";

import { useState, useEffect } from "react";
import { X, Save, Phone, Loader2, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhone: string;
  onSave: (newPhone: string) => Promise<void>;
  userId: string;
}

export function EditProfileModal({ isOpen, onClose, currentPhone, onSave, userId }: EditProfileModalProps) {
  const [phone, setPhone] = useState(currentPhone);
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
        setPhone(currentPhone);
        setStatus("idle");
    }
  }, [isOpen, currentPhone]);

  // Phone Check Logic
  useEffect(() => {
    if (phone === currentPhone) {
        setStatus("idle");
        return;
    }
    
    if (phone.length < 7) {
        setStatus("idle");
        return;
    }

    const checkPhone = async () => {
      setStatus("checking");
      try {
        const q = query(collection(db, "users"), where("phone", "==", phone));
        const snap = await getDocs(q);
        const isTaken = !snap.empty && snap.docs[0].id !== userId;
        
        setStatus(isTaken ? "taken" : "available");
      } catch (e) {
        console.error("Phone check error", e);
        setStatus("idle");
      }
    };

    const timeoutId = setTimeout(checkPhone, 500);
    return () => clearTimeout(timeoutId);
  }, [phone, currentPhone, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "taken" || status === "checking") return;
    
    setIsSaving(true);
    await onSave(phone);
    setIsSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto z-[70] w-full max-w-md h-fit p-6 bg-white rounded-3xl shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={cn(
                                "w-full bg-gray-50 border-2 border-transparent rounded-xl pl-12 pr-10 py-3 font-semibold text-gray-900 outline-none focus:border-blue-500 transition-all",
                                status === "taken" && "border-red-500 focus:border-red-500 bg-red-50",
                                status === "available" && "border-green-500 focus:border-green-500 bg-green-50"
                            )}
                            placeholder="+123 456 7890"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {status === "checking" && <Loader2 className="animate-spin text-gray-400" size={18} />}
                            {status === "available" && <Check className="text-green-500" size={18} />}
                            {status === "taken" && <X className="text-red-500" size={18} />}
                        </div>
                    </div>
                    {status === "taken" && (
                        <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                            <AlertCircle size={12} /> This number is already in use.
                        </p>
                    )}
                </div>

                <div className="flex gap-3">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isSaving || status === "taken" || status === "checking" || phone === currentPhone}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}