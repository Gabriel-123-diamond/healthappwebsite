import { Activity, Leaf, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchMode } from "@/lib/ai/service";
import { motion } from "framer-motion";

interface ModeToggleProps {
  currentMode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
}

export function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
  const modes: { id: SearchMode; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "medical", label: "Medical", icon: <Activity size={18} />, color: "bg-blue-600" },
    { id: "herbal", label: "Herbal", icon: <Leaf size={18} />, color: "bg-green-600" },
    { id: "both", label: "Combined", icon: <Layers size={18} />, color: "bg-purple-600" },
  ];

  return (
    <div className="flex p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl w-fit border border-gray-200">
      {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 z-10",
                isActive
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className={cn("absolute inset-0 rounded-xl shadow-md", mode.color)}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
              )}
              <span className="relative z-10 flex items-center gap-2">
                 {mode.icon} {mode.label}
              </span>
            </button>
          );
      })}
    </div>
  );
}