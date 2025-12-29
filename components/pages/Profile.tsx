"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BentoCard from "@/components/ui/BentoCard";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "next-themes";
import { BookOpen, Award, Moon, Sun, X } from "lucide-react";

export default function Profile() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [mistakes, setMistakes] = useState([
    {
      id: 1,
      date: "2024-01-15",
      topic: "老龄化",
      mistake: "使用了错误的时态",
      correction: "应该使用现在完成时",
      example: "The population has been aging...",
    },
    {
      id: 2,
      date: "2024-01-14",
      topic: "环保",
      mistake: "词伙搭配不当",
      correction: "应该使用 'environmental protection' 而不是 'environment protect'",
      example: "Environmental protection is crucial...",
    },
  ]);

  const badges = [
    { id: 1, name: "初出茅庐", icon: "🌱", earned: true, date: "2024-01-10" },
    { id: 2, name: "逻辑大师", icon: "🧠", earned: true, date: "2024-01-12" },
    { id: 3, name: "词伙达人", icon: "📚", earned: true, date: "2024-01-14" },
    { id: 4, name: "写作新星", icon: "⭐", earned: false },
    { id: 5, name: "完美主义", icon: "💎", earned: false },
    { id: 6, name: "坚持不懈", icon: "🔥", earned: false },
  ];

  const handleDeleteMistake = (id: number) => {
    setMistakes(mistakes.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-text-primary mb-2">我的</h1>
          <p className="text-text-secondary">个人中心与学习记录</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings */}
          <BentoCard span="col-span-1">
            <h2 className="text-xl font-bold text-text-primary mb-6">设置</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-hover rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon className="w-5 h-5 text-primary" />
                  ) : (
                    <Sun className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-text-primary">主题模式</div>
                    <div className="text-xs text-text-secondary">
                      {isDarkMode ? "深色模式" : "浅色模式"}
                    </div>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </BentoCard>

          {/* Mistake Notebook */}
          <BentoCard span="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">错题本</h2>
                <p className="text-sm text-text-secondary">
                  记录你的错误，避免重复犯错
                </p>
              </div>
            </div>

            {mistakes.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>还没有记录任何错误</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mistakes.map((mistake, index) => (
                  <motion.div
                    key={mistake.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface border border-border rounded-lg p-4 relative"
                  >
                    <button
                      onClick={() => handleDeleteMistake(mistake.id)}
                      className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {mistake.topic}
                        </div>
                        <div className="text-xs text-text-secondary">{mistake.date}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-text-secondary mb-1">错误</div>
                        <div className="text-sm text-text-primary bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                          {mistake.mistake}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary mb-1">纠正</div>
                        <div className="text-sm text-text-primary bg-primary/10 border border-primary/20 rounded px-3 py-2">
                          {mistake.correction}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary mb-1">示例</div>
                        <div className="text-sm text-text-secondary italic">
                          {mistake.example}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </BentoCard>

          {/* Badges */}
          <BentoCard span="col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">徽章</h2>
                <p className="text-sm text-text-secondary">收集成就徽章，记录你的成长</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    flex flex-col items-center justify-center p-6 rounded-lg border-2
                    transition-all duration-300
                    ${
                      badge.earned
                        ? "bg-primary/10 border-primary shadow-glow"
                        : "bg-surface border-border opacity-50"
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div
                    className={`text-sm font-medium text-center ${
                      badge.earned ? "text-text-primary" : "text-text-muted"
                    }`}
                  >
                    {badge.name}
                  </div>
                  {badge.earned && badge.date && (
                    <div className="text-xs text-text-secondary mt-1">{badge.date}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}

