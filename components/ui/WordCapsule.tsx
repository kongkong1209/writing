"use client";

import { motion } from "framer-motion";

interface WordCapsuleProps {
  word: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function WordCapsule({
  word,
  selected = false,
  onClick,
  disabled = false,
}: WordCapsuleProps) {
  return (
    <motion.button
      className={`
        px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200
        ${
          selected
            ? "bg-primary text-background shadow-glow"
            : "bg-surface border border-border text-text-primary hover:bg-surface-hover"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
    >
      {word}
    </motion.button>
  );
}

