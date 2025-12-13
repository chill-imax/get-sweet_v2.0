"use client";
import { Loader2, Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 my-4">
      <div className="self-end">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-md">
          <Sparkles className="text-white w-5 h-5" />
        </div>
      </div>

      <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-md rounded-bl-none">
        <div className="flex gap-2 items-center">
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-sm text-gray-500">
            Sweet Manager is working…
          </span>
        </div>
      </div>
    </div>
  );
}
