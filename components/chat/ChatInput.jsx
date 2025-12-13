"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, isTyping }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() || isTyping) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize hasta 7 líneas
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const lineHeight = 20;
    const maxHeight = lineHeight * 7;
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
  }, [text]);

  const canSend = text.trim().length > 0 && !isTyping;

  return (
    <div className="w-full py-4 flex items-center gap-3">
      {/* Textarea */}
      <div className="bg-gray-100 flex items-center flex-1 rounded-2xl px-4 py-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isTyping
              ? "Sweet Manager is generating a response..."
              : "Ask Sweet Manager anything..."
          }
          rows={1}
          className="md:px-2 flex-1 bg-transparent outline-none resize-none text-base text-gray-700 placeholder-gray-400 leading-6 max-h-[168px] overflow-y-auto"
        />
      </div>

      {/* Botón de enviar */}
      <button
        onClick={handleSend}
        disabled={!canSend}
        className={`
          w-10 h-10 flex items-center justify-center rounded-full shadow-md transition
          ${
            !canSend
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-linear-to-r from-fuchsia-500 to-purple-600 text-white hover:opacity-90 transition hover:scale-105"
          }
        `}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
