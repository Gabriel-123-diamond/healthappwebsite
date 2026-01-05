"use client";

import { useState } from "react";
import { Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function BroadcastManager() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body || !user) return;

    setStatus("sending");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ title, body }),
      });

      if (res.ok) {
        setStatus("success");
        setTitle("");
        setBody("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Health Alert Broadcast</h3>
          <p className="text-sm text-gray-500">Send push notifications to all mobile users.</p>
        </div>
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alert Title</label>
          <input 
            type="text" 
            placeholder="e.g., Flu Season Warning" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 transition-all font-bold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message Body</label>
          <textarea 
            placeholder="e.g., Cases are rising in your area. Please stay hydrated and avoid crowds." 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 transition-all min-h-[100px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <button 
          type="submit"
          disabled={status === "sending" || !title || !body}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:bg-gray-300 disabled:shadow-none"
        >
          {status === "sending" ? "Sending Broadcast..." : <><Send size={18} /> Send Alert</>}
        </button>

        {status === "success" && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={18} /> Alert sent successfully to all subscribers!
          </div>
        )}
        
        {status === "error" && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertTriangle size={18} /> Failed to send alert. Check console/logs.
          </div>
        )}
      </form>
    </div>
  );
}
