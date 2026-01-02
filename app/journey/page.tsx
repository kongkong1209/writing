"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { levelsData } from "@/lib/levels";
import { getProgress, UserProgress } from "@/lib/progress";

// Generate all 31 levels with fallback titles
const generateLevels = () => {
  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const levelData = levelsData[day];
    const titles = ["Aging", "Environment", "Education", "Tech", "Crime"];
    const title = levelData?.title || titles[(day - 1) % titles.length] || `Topic ${day}`;

    return { day, title };
  });
};

export default function JourneyPage() {
  // Store progress in state
  const [progress, setProgress] = useState<UserProgress>({ completedLevels: [], maxLevel: 1 });
  const [isClient, setIsClient] = useState(false);

  // Load progress on mount
  useEffect(() => {
    setProgress(getProgress());
    setIsClient(true);
  }, []);

  const levels = generateLevels();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0C0E] py-20 px-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Decor (Adaptive) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-400/20 dark:bg-[#96BF48]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
            Writing Journey
          </h1>
          <p className="text-gray-500 dark:text-gray-400 transition-colors">
            Complete 31 levels to master IELTS Writing
          </p>
          {isClient && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Progress: {progress.completedLevels.length} / 31 completed
            </p>
          )}
        </div>

        {/* --- CENTRAL ROAD --- */}
        <div className="relative">
          {/* The Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gray-200 dark:bg-[#1A1C1E] -translate-x-1/2 rounded-full transition-colors">
            <div className="w-full h-1/4 bg-gradient-to-b from-green-500 to-transparent dark:from-[#96BF48] opacity-50" />
          </div>

          {/* Level Nodes */}
          <div className="space-y-12">
            {levels.map((level, index) => {
              const isLeft = index % 2 === 0;
              
              // Calculate Status Dynamically
              const isCompleted = isClient && progress.completedLevels.includes(level.day);
              const isActive = isClient && level.day === progress.maxLevel;
              const isLocked = isClient && level.day > progress.maxLevel;

              return (
                <motion.div
                  key={level.day}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className={`flex items-center w-full ${isLeft ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* CARD */}
                  <div className={`w-[45%] ${isLeft ? "text-right" : "text-left"}`}>
                    {isLocked ? (
                      <div
                        className={`
                          relative inline-block w-full max-w-[280px] p-4 rounded-2xl border-b-4 transition-all duration-300 group cursor-not-allowed
                          bg-gray-100 dark:bg-[#141517] border-gray-200 dark:border-[#2A2D30] border-b-gray-300 dark:border-b-black opacity-80
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Day {level.day}
                          </span>
                          <Lock className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                        </div>
                        <h3 className="text-lg font-bold transition-colors text-gray-400 dark:text-gray-500">
                          {level.title}
                        </h3>
                      </div>
                    ) : (
                      <Link href={`/journey/${level.day}`}>
                        <div
                          className={`
                            relative inline-block w-full max-w-[280px] p-4 rounded-2xl border-b-4 transition-all duration-300 group cursor-pointer
                            ${
                              isActive
                                ? "bg-white dark:bg-[#1A1C1E] border-green-500 dark:border-[#96BF48] border-b-green-600 dark:border-b-[#96BF48] shadow-lg shadow-green-200/50 dark:shadow-[0_0_30px_rgba(150,191,72,0.2)] -translate-y-1"
                                : isCompleted
                                ? "bg-yellow-50 dark:bg-[#1A1C1E] border-yellow-400 dark:border-yellow-600/50 border-b-yellow-500 dark:border-b-yellow-600/50"
                                : "bg-gray-100 dark:bg-[#141517] border-gray-200 dark:border-[#2A2D30] border-b-gray-300 dark:border-b-black opacity-80 hover:opacity-100"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-xs font-bold uppercase tracking-wider ${
                                isActive
                                  ? "text-green-600 dark:text-[#96BF48]"
                                  : isCompleted
                                  ? "text-yellow-600 dark:text-yellow-500"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                            >
                              Day {level.day}
                            </span>
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                            ) : isActive ? (
                              <div className="absolute -right-2 -top-2 w-4 h-4 bg-green-500 dark:bg-[#96BF48] rounded-full animate-ping" />
                            ) : null}
                          </div>

                          <h3
                            className={`text-lg font-bold transition-colors ${
                              isActive
                                ? "text-gray-900 dark:text-white"
                                : isCompleted
                                ? "text-gray-800 dark:text-gray-300"
                                : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                            }`}
                          >
                            {level.title}
                          </h3>
                        </div>
                      </Link>
                    )}
                  </div>

                  {/* CONNECTOR DOT */}
                  <div className="relative z-10 w-[10%] flex justify-center">
                    <div
                      className={`
                      w-4 h-4 rounded-full border-2 transition-colors
                      ${
                        isActive || isCompleted
                          ? "bg-gray-50 dark:bg-[#0B0C0E] border-green-500 dark:border-[#96BF48]"
                          : "bg-gray-100 dark:bg-[#0B0C0E] border-gray-300 dark:border-gray-700"
                      }
                    `}
                    />
                  </div>

                  <div className="w-[45%]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
