"use client";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageBubble({ sender = "agent", text }) {
  const isUser = sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`w-full flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar del agente */}
      {!isUser && (
        <div className="mr-3 self-end">
          <AvatarIcon />
        </div>
      )}

      <div
        className={`max-w-[75%] md:max-w-[70%] p-4 rounded-2xl shadow-sm break-words
          ${
            isUser
              ? "bg-purple-600 text-white rounded-br-none shadow-md"
              : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
          }`}
      >
        {/* Nombre del autor */}
        <p
          className={`text-xs font-bold mb-2 ${
            isUser ? "text-purple-200" : "text-gray-400"
          }`}
        >
          {isUser ? "You" : "Sweet Manager"}
        </p>

        {/* Contenido Markdown dentro de un div */}
        <div className="text-sm md:text-base leading-relaxed space-y-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              p: ({ children }) => <p className="mb-2">{children}</p>,
              li: ({ children }) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {String(text)}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}

function AvatarIcon() {
  return (
    <div className="w-9 h-9 rounded-full shadow flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500">
      <Bot className="text-white w-5 h-5" />
    </div>
  );
}
