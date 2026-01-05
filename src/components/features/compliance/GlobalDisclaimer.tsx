import { Info } from "lucide-react";

export function GlobalDisclaimer() {
  return (
    <div className="w-full bg-blue-50 border-t border-blue-100 p-4 mt-8">
      <div className="max-w-3xl mx-auto flex gap-3 text-xs text-blue-800">
        <Info className="shrink-0 mt-0.5" size={16} />
        <p className="leading-relaxed">
          <strong>Medical Disclaimer:</strong> The content provided by HealthAI is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. 
          Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
          Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
          <br /><br />
          <strong>Emergency:</strong> If you think you may have a medical emergency, call your doctor or emergency services immediately.
        </p>
      </div>
    </div>
  );
}
