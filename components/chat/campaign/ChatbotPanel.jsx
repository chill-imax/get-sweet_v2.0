"use client";

import { useState } from "react";
import { parseChatCommand } from "@/components/chat/campaign/helpers/campaignParser";

/* Subcomponente Bubble local */
function ChatBubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div
      className={`flex items-end gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
          SM
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 border text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-800 border-gray-200"
        }`}
      >
        {text}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
          You
        </div>
      )}
    </div>
  );
}

export default function ChatbotPanel({ onApplyPatch, onAddAdGroup }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Welcome to Campaign AI.\n\n" +
        "Tell me what you’re trying to achieve and I’ll update Campaign Details + Ad Groups automatically.\n\n" +
        "Try:\n" +
        "• “Set geo to San Mateo County”\n" +
        "• “Budget $50/day”\n" +
        "• “Add ad group emergency plumbing”",
    },
  ]);

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");

    const parsed = parseChatCommand(trimmed);
    const patches = {};
    if (parsed.name) patches.name = parsed.name;
    if (parsed.objective) patches.objective = parsed.objective;
    if (parsed.geo) patches.geo = parsed.geo;
    if (parsed.budget) patches.budget = parsed.budget;
    if (parsed.landingUrl) patches.landingUrl = parsed.landingUrl;
    if (parsed.language) patches.language = parsed.language;

    const didPatch = Object.keys(patches).length > 0;
    const didAddAdGroup = Boolean(parsed.addAdGroupName);

    if (didPatch) onApplyPatch(patches);
    if (didAddAdGroup) onAddAdGroup(parsed.addAdGroupName);

    setIsTyping(true);

    setTimeout(() => {
      const lines = [];

      if (didPatch || didAddAdGroup) {
        lines.push("Done ✅");
        if (didPatch) {
          lines.push("");
          lines.push("Updated campaign details:");
          Object.entries(patches).forEach(([k, v]) =>
            lines.push(`• ${k}: ${v}`)
          );
        }
        if (didAddAdGroup) {
          lines.push("");
          lines.push("Added ad group:");
          lines.push(`• ${parsed.addAdGroupName}`);
          lines.push("  – Theme: (add keywords / intent)");
        }
        lines.push("");
        lines.push("Want me to generate a Google Ads draft next?");
      } else {
        lines.push(
          "Got it. Tell me what to change (objective, geo, budget, landing page, ad groups).\n\n" +
            "Example: “Set objective to lead gen and add ad group clogged drain”."
        );
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: lines.join("\n") },
      ]);
    }, 450);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-50">
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-5">
        <div className="max-w-4xl mx-auto space-y-3">
          {messages.map((m, idx) => (
            <ChatBubble key={idx} role={m.role} text={m.text} />
          ))}
          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                SM
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse delay-75" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse delay-150" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-white px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Message Campaign AI…"
                className="w-full min-h-11 max-h-35 resize-none px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gray-200"
              />
              <div className="mt-2 text-[11px] text-gray-500">
                Quick commands: <span className="font-mono">objective</span>,{" "}
                <span className="font-mono">geo</span>,{" "}
                <span className="font-mono">budget</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="h-11 px-5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
