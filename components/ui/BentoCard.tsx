"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  span?: "col-span-1" | "col-span-2" | "col-span-3";
  rowSpan?: "row-span-1" | "row-span-2";
  onClick?: () => void;
}

export default function BentoCard({
  children,
  className = "",
  span = "col-span-1",
  rowSpan = "row-span-1",
  onClick,
}: BentoCardProps) {
  return (
    <motion.div
      className={`
        ${span} ${rowSpan}
        bg-surface border border-border rounded-card
        p-6 shadow-card
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      whileHover={onClick ? { scale: 1.02, shadow: "card-hover" } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

