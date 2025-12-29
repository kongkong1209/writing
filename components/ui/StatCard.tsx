"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <motion.div
      className="bg-surface border border-border rounded-card p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-secondary text-sm">{label}</span>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-text-primary">{value}</span>
        {trend && (
          <span
            className={`text-sm ${
              trend === "up"
                ? "text-primary"
                : trend === "down"
                ? "text-red-400"
                : "text-text-muted"
            }`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
    </motion.div>
  );
}

