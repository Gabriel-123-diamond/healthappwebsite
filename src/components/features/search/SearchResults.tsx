import { ExternalLink, Video, FileText, Share2, Bookmark, Check } from "lucide-react";
import { SearchResponse } from "@/lib/ai/service";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/context/AuthContext";
import { saveResource } from "@/lib/user-service";

interface SearchResultsProps {
  data: SearchResponse;
}

export function SearchResults({ data }: SearchResultsProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (data.safetyCheck.isSafe === false) return null; 

  const handleShare = () => {
    navigator.clipboard.writeText(`${data.summary}\n\nSource: Global Health AI`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
      if (user) {
          await saveResource(user.uid, {
              title: "AI Health Summary",
              link: window.location.href,
              snippet: data.summary.substring(0, 100) + "...",
              type: "summary"
          });
          setSaved(true);
      } else {
          alert("Please login to save.");
      }
  };

  const handleSaveSource = async (e: React.MouseEvent, source: any) => {
      e.preventDefault();
      e.stopPropagation();
      if (user) {
          await saveResource(user.uid, {
              title: source.title,
              link: source.url,
              snippet: source.snippet,
              type: source.type
          });
          alert("Resource Saved!");
      } else {
          alert("Please login to save.");
      }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* AI Summary Card */}
      <div className="relative bg-white border border-blue-100/50 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-50/50 overflow-hidden">
        
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />

        <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                AI Health Summary
                <span className="text-[10px] font-normal text-white bg-blue-600 px-2 py-0.5 rounded-full tracking-wide uppercase">
                    Beta
                </span>
            </h2>
            <div className="flex gap-2">
                <button 
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                    title="Copy to clipboard"
                >
                    {copied ? <Check size={20} className="text-green-500" /> : <Share2 size={20} />}
                </button>
                <button 
                    onClick={handleSave}
                    className={cn(
                        "p-2 rounded-full transition-all",
                        saved ? "text-yellow-500 bg-yellow-50" : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                    )}
                    title="Save to profile"
                >
                    <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
                </button>
            </div>
        </div>
        
        <div className="prose prose-blue prose-lg text-gray-600 leading-relaxed max-w-none">
          <ReactMarkdown>{data.summary}</ReactMarkdown>
        </div>
      </div>

      {/* Trusted Sources Grid */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Trusted References</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.sources.map((source, index) => (
            <div key={index} className="relative group h-full">
                <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-3 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200 transition-all h-full"
                >
                <div className="flex justify-between items-start">
                    <div className={cn(
                        "p-2.5 rounded-xl w-fit transition-colors",
                        source.type === 'video' ? "bg-red-50 text-red-600 group-hover:bg-red-100" : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                    )}>
                        {source.type === "video" ? <Video size={20} /> : <FileText size={20} />}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => handleSaveSource(e, source)}
                            className="text-gray-300 hover:text-yellow-500 transition-colors p-1"
                            title="Bookmark"
                        >
                            <Bookmark size={18} />
                        </button>
                        <ExternalLink size={16} className="text-gray-300 group-hover:text-blue-400 transition-colors mt-1" />
                    </div>
                </div>
                
                <div>
                    <h4 className="font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                    {source.title}
                    </h4>
                    {source.snippet && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                            {source.snippet}
                        </p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-3 truncate font-medium bg-gray-50 w-fit px-2 py-1 rounded-md">
                        {new URL(source.url).hostname.replace('www.', '')}
                    </p>
                </div>
                </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}