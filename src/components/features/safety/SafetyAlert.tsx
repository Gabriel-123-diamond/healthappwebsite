import { AlertTriangle, PhoneCall } from "lucide-react";
import { SafetyCheckResult } from "@/lib/ai/safety";

interface SafetyAlertProps {
  result: SafetyCheckResult;
}

export function SafetyAlert({ result }: SafetyAlertProps) {
  if (result.isSafe) return null;

  return (
    <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-100 rounded-full text-red-600">
          <AlertTriangle size={32} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-700">Medical Emergency Warning</h3>
          <p className="text-red-800 mt-1">{result.message}</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <button className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
          <PhoneCall size={20} />
          Call Emergency Services
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-red-200 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors">
            Find Nearest Hospital
        </button>
      </div>
    </div>
  );
}
