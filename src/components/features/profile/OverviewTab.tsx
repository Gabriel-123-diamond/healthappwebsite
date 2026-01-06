"use client";

import { Activity, Settings, LogOut, Check } from "lucide-react";
import { motion } from "framer-motion";

interface OverviewTabProps {
  historyCount: number;
  savedCount: number;
  logout: () => void;
  isGoogleLinked: boolean;
  linkingStatus: "idle" | "loading" | "success" | "error";
  handleGoogleLink: () => void;
}

export function OverviewTab({
  historyCount,
  savedCount,
  logout,
  isGoogleLinked,
  linkingStatus,
  handleGoogleLink
}: OverviewTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      key="overview"
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity size={18} className="text-blue-500" /> Health Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl">
            <span className="text-2xl font-black text-blue-600 block">{historyCount}</span>
            <span className="text-xs font-bold text-blue-400 uppercase">Searches</span>
          </div>
          <div className="bg-purple-50 p-4 rounded-2xl">
            <span className="text-2xl font-black text-purple-600 block">{savedCount}</span>
            <span className="text-xs font-bold text-purple-400 uppercase">Saved</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Settings size={18} className="text-gray-400" /> Account Settings
          </h3>

          {/* Linked Accounts */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Linked Accounts</p>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span className="font-semibold text-gray-700">Google</span>
              </div>
              {isGoogleLinked ? (
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg flex items-center gap-1">
                  <Check size={12} /> Connected
                </span>
              ) : (
                <button
                  onClick={handleGoogleLink}
                  disabled={linkingStatus === "loading"}
                  className="text-xs font-bold text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {linkingStatus === "loading" ? "Connecting..." : "Connect"}
                </button>
              )}
            </div>
            {linkingStatus === "error" && <p className="text-xs text-red-500 mt-2">Failed to connect Google. Try again.</p>}
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </motion.div>
  );
}