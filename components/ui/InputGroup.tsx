"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InputGroupProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  icon?: ReactNode;
  className?: string;
}

export default function InputGroup({
  label,
  placeholder,
  value,
  onChange,
  icon,
  className = "",
}: InputGroupProps) {
  return (
    <motion.div
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        {label}
      </label>
      <motion.input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface border border-border rounded-card px-4 py-3 
                   text-text-primary placeholder-text-muted
                   focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                   transition-all duration-200"
        whileFocus={{ scale: 1.01 }}
      />
    </motion.div>
  );
}

