import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";
import Confetti from "react-confetti";

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <Confetti recycle={false} numberOfPieces={500} gravity={0.2} />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl relative"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full relative">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <Sparkles className="absolute -top-2 -right-2 text-yellow-500 w-8 h-8 animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to the Club!
        </h2>
        <p className="text-gray-500 mb-8">
          Your subscription has been successfully activated. You&apos;re now
          ready to scale your campaigns with AI power.
        </p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-purple-600 text-white font-semibold rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessModal;
