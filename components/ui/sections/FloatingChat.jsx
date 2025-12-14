"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const FloatingChatIcon = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Link href="/chat">
      <motion.div
        drag
        dragConstraints={{
          top: 0,
          bottom: windowSize.height - 80,
          left: 0,
          right: windowSize.width - 80,
        }}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-pink-500 shadow-lg flex items-center justify-center cursor-pointer z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot className="w-7 h-7 text-white" />
      </motion.div>
    </Link>
  );
};

export default FloatingChatIcon;
