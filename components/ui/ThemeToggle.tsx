"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-12 h-6 rounded-full bg-surface border border-border" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-12 h-6 rounded-full transition-colors bg-surface border border-border hover:bg-surface-hover"
      aria-label="切换主题"
    >
      <motion.div
        className="absolute top-1 left-1 w-4 h-4 bg-background rounded-full flex items-center justify-center"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-primary" />
        ) : (
          <Sun className="w-3 h-3 text-primary" />
        )}
      </motion.div>
    </button>
  );
}

