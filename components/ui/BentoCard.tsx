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
        p-6
        shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]
        dark:shadow-card
        ${onClick ? "cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.06)] dark:hover:shadow-card-hover" : ""}
        ${className}
      `}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

