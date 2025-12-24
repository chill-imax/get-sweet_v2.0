"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import SuggestionChips from "./SuggestionChips";
import ChatInput from "./ChatInput";
import { useAuth } from "@/context/useContext";
import ToneSelector from "../ui/inputs/ToneSelector";

export default function ChatWindow({ activeContext }) {
  const { token, user } = useAuth();

  // Estados
  const [guestId, setGuestId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Datos extraídos del análisis
  const [extracted, setExtracted] = useState({
    mission: "",
    vision: "",
    values: [],
    targetAudience: "",
    tone: "Professional",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Estado del selector de tono
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [suggestedTone, setSuggestedTone] = useState(null);

  const scrollRef = useRef(null);
  const userId = user?._id || guestId;

  // 1. Gestión de Guest ID
  useEffect(() => {
    if (!user) {
      let gid = localStorage.getItem("guestId");
      if (!gid) {
        gid = "guest-" + crypto.randomUUID();
        localStorage.setItem("guestId", gid);
      }
      setGuestId(gid);
    }
  }, [user]);

  // 2. Cargar Historial (Corregido)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (activeContext && activeContext !== "general") {
          queryParams.append("campaignId", activeContext);
        }

        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/v1/chat/history?${queryParams.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch chat history");

        const data = await res.json();

        // Mapeo crucial: Backend 'content' -> Frontend 'text'
        const formattedMessages = data.map((msg) => ({
          id: msg._id || msg.id || crypto.randomUUID(),
          role: msg.role,
          text: msg.content, // Aquí solucionamos el undefined
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("❌ Error loading history:", error);
      }
    };

    if (token) fetchHistory();
  }, [token, activeContext]);

  // 3. Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, showToneSelector]);

  // 4. Cambiar Tono
  const handleToneSelect = async (selectedTone) => {
    setExtracted((prev) => ({ ...prev, tone: selectedTone }));
    setSuggestedTone(selectedTone);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/company/tone`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tone: selectedTone }),
        }
      );

      if (!res.ok) throw new Error("Error updating tone");
      setTimeout(() => setShowToneSelector(false), 500);
    } catch (err) {
      console.error("Failed to update tone:", err);
    }
  };

  // 5. Enviar Mensaje
  const handleSend = useCallback(
    async (text) => {
      if (!text || !text.trim()) return;

      setIsLoading(true);
      setError("");
      setShowToneSelector(false);
      setSuggestedTone(null);

      // UI Optimista
      const userMsg = {
        id: crypto.randomUUID(),
        role: "user",
        text,
      };
      setMessages((prev) => [...prev, userMsg]);

      // Modo Guest
      if (!userId || userId.startsWith("guest-")) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              text: "Thanks! Please register to unlock full AI capabilities.",
            },
          ]);
          setIsLoading(false);
        }, 500);
        return;
      }

      // Usuario Autenticado
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/message`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId,
              userMessage: text,
              campaignId: activeContext !== "general" ? activeContext : null,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Server Error");

        const replyText = typeof data.reply === "string" ? data.reply : "";

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: replyText,
          },
        ]);

        if (data.companyData) {
          setExtracted((prev) => ({
            ...prev,
            ...data.companyData,
          }));
        }

        if (data.triggerToneSelector) {
          setShowToneSelector(true);
          if (data.suggestedTone) {
            setSuggestedTone(data.suggestedTone);
          }
        }
      } catch (err) {
        console.error("❌ Message Error:", err);
        setError("Connection error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [userId, token, activeContext]
  );

  const hasConversation = messages.length > 0;

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
        {!hasConversation ? (
          <div className="flex flex-col h-full items-center justify-center text-center p-4">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600 p-1">
              Ready to grow your business?
            </h1>
            <p className="text-gray-600 text-lg max-w-xl mb-10 mt-2">
              I&apos;m Sweet Manager — your AI marketing partner.
            </p>

            <SuggestionChips
              suggestions={[
                "I want my brand to go viral",
                "Create a mission, vision and values",
                "I don't have a brand name yet",
              ]}
              onSelect={handleSend}
            />
          </div>
        ) : (
          <>
            {/* Panel de Datos Detectados */}
            {(extracted.mission ||
              extracted.vision ||
              (Array.isArray(extracted.values) &&
                extracted.values.length > 0) ||
              extracted.targetAudience) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="pb-6 border-b border-gray-100 mb-6"
              >
                <div className="bg-purple-50/50 border border-purple-200 rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-bold text-purple-700 mb-2">
                    💡 Brand DNA Detected
                  </h4>
                  <div className="text-xs text-gray-700 space-y-2">
                    {extracted.mission && (
                      <p>
                        <strong>Misión:</strong> {extracted.mission}
                      </p>
                    )}
                    {extracted.vision && (
                      <p>
                        <strong>Visión:</strong> {extracted.vision}
                      </p>
                    )}
                    {Array.isArray(extracted.values) &&
                      extracted.values.length > 0 && (
                        <p>
                          <strong>Valores:</strong>{" "}
                          {extracted.values.join(", ")}
                        </p>
                      )}
                    {extracted.targetAudience && (
                      <p>
                        <strong>Audiencia:</strong> {extracted.targetAudience}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Lista de Mensajes */}
            <div className="space-y-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} sender={m.role} text={m.text} />
              ))}

              {isLoading && <TypingIndicator />}

              {/* Selector de Tono */}
              {showToneSelector && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-2 md:ml-10 max-w-[90%]"
                >
                  <div className="mb-2 text-xs font-semibold text-purple-600">
                    {suggestedTone
                      ? `¿Cambiar a tono ${suggestedTone}?`
                      : "Ajustar tono:"}
                  </div>
                  <ToneSelector
                    currentTone={suggestedTone || extracted.tone}
                    onSelect={handleToneSelect}
                  />
                </motion.div>
              )}

              <div ref={scrollRef} />
            </div>
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-2 p-2 bg-red-50 text-red-600 text-xs rounded text-center border border-red-100">
              Error del Agente: {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-2 border border-gray-200">
            <ChatInput onSend={handleSend} isTyping={isLoading} />
          </div>

          <p className="text-center text-[10px] text-gray-400 mt-2">
            Sweet Manager can make mistakes
          </p>
        </div>
      </div>
    </div>
  );
}
