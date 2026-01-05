import { Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
  className?: string;
}

export function SearchInput({ value, onChange, onSearch, isLoading, className }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const clearInput = () => {
      onChange("");
      inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full max-w-2xl group", className)}>
      <div className="relative flex items-center w-full h-16 rounded-3xl bg-white border-2 border-transparent focus-within:border-blue-500 shadow-sm hover:shadow-md transition-all duration-300 ease-out overflow-hidden">
        
        {/* Search Icon */}
        <div className="grid place-items-center h-full w-14 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <Search size={22} />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          className="peer h-full w-full outline-none text-lg text-gray-800 placeholder:text-gray-400 bg-transparent pr-2"
          type="text"
          id="search"
          placeholder="Describe symptoms, herbs, or ask a question..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        {/* Action Buttons Area */}
        <div className="flex items-center gap-2 pr-2">
            
            {/* Clear Button (only if text exists) */}
            {value && !isLoading && (
                <button 
                    onClick={clearInput}
                    className="p-2 text-gray-300 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
                >
                    <X size={18} />
                </button>
            )}

            {/* Search / Loading Button */}
            <button 
                onClick={onSearch}
                disabled={isLoading || !value.trim()}
                className="h-11 px-6 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        <span className="hidden sm:inline">Analyzing</span>
                    </>
                ) : (
                    "Search"
                )}
            </button>
        </div>
      </div>
    </div>
  );
}