"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  disabled = false,
}: ButtonProps) {
  const baseStyles = "rounded-button font-medium transition-all duration-200";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-[0_0_20px_rgba(91,140,58,0.2)] dark:shadow-[0_0_20px_rgba(150,191,72,0.3)]",
    secondary: "bg-surface border border-border hover:bg-surface-hover text-text-primary",
    ghost: "bg-transparent hover:bg-surface text-text-secondary hover:text-text-primary",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

