"use client";

import { motion } from "framer-motion";
import { Check, Lock, FileText, FileEdit } from "lucide-react";

interface TimelineItem {
  id: number;
  day: number;
  title: string;
  type: "essay" | "letter";
  status: "locked" | "current" | "completed";
}

interface TimelineProps {
  items: TimelineItem[];
  onItemClick?: (item: TimelineItem) => void;
}

export default function Timeline({ items, onItemClick }: TimelineProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide pb-4">
      <div className="flex gap-0 min-w-max px-2 relative">
        {items.map((item, index) => {
          const isLocked = item.status === "locked";
          const isCurrent = item.status === "current";
          const isCompleted = item.status === "completed";

          return (
            <div key={item.id} className="flex items-center">
              <motion.div
                className="flex flex-col items-center gap-2 min-w-[80px] relative z-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Icon circle */}
                <motion.div
                  className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center
                    border-2 transition-all duration-300
                    ${
                      isCurrent
                        ? "bg-primary border-primary shadow-glow scale-110"
                        : isCompleted
                        ? "bg-primary/20 border-primary"
                        : "bg-surface border-border"
                    }
                    ${!isLocked && onItemClick ? "cursor-pointer" : ""}
                  `}
                  whileHover={!isLocked && onItemClick ? { scale: 1.15 } : {}}
                  onClick={() => !isLocked && onItemClick && onItemClick(item)}
                >
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-text-muted" />
                  ) : isCompleted ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : item.type === "essay" ? (
                    <FileText className="w-5 h-5 text-text-primary" />
                  ) : (
                    <FileEdit className="w-5 h-5 text-text-primary" />
                  )}
                </motion.div>

                {/* Day label */}
                <div className="text-center">
                  <div className="text-xs text-text-secondary">Day {item.day}</div>
                  {isCurrent && (
                    <motion.div
                      className="text-xs text-primary font-medium mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      进行中
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Connection line */}
              {index < items.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    isCompleted ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

