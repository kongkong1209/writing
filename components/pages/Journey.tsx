"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import BentoCard from "@/components/ui/BentoCard";
import {
  Lock,
  CheckCircle,
  Factory,
  Home,
  School,
  Leaf,
  TreePine,
  Cpu,
  Scale,
  BarChart3,
  Server,
} from "lucide-react";

interface CityNode {
  id: number;
  day: number;
  name: string;
  type: "city" | "zone";
  status: "locked" | "active" | "completed";
  icon: React.ReactNode;
}

function FloatingIsland({
  node,
  isLeft,
  isDark,
}: {
  node: CityNode;
  isLeft: boolean;
  isDark: boolean;
}) {
  const isLocked = node.status === "locked";
  const isActive = node.status === "active";
  const isCompleted = node.status === "completed";

  const baseWidth = node.type === "zone" ? 80 : 100;
  const baseHeight = node.type === "zone" ? 60 : 80;
  const depth = 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: node.day * 0.03, type: "spring", stiffness: 200 }}
      className={`relative ${isLocked ? "opacity-40 grayscale" : ""}`}
    >
      {isActive && (
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-60"
            style={{
              background: `radial-gradient(circle, ${isDark ? "rgba(150, 191, 72, 0.4)" : "rgba(91, 140, 58, 0.3)"} 0%, transparent 70%)`,
            }}
          />
        </div>
      )}

      {!isLocked && (
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-6 rounded-full blur-md"
          style={{
            background: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.15)",
          }}
        />
      )}

      <div className="relative" style={{ width: baseWidth, height: baseHeight }}>
        <div
          className="absolute"
          style={{
            width: `${depth}px`,
            height: `${baseHeight}px`,
            left: `${baseWidth}px`,
            top: `${depth}px`,
            background: isCompleted
              ? "linear-gradient(to bottom, #F59E0B, #FCD34D)"
              : isActive
              ? isDark
                ? "linear-gradient(to bottom, #30E680, #96BF48)"
                : "linear-gradient(to bottom, #6B9F4A, #5B8C3A)"
              : isDark
              ? "linear-gradient(to bottom, #232528, #1A1C1E)"
              : "linear-gradient(to bottom, #F3F4F6, #E5E7EB)",
            transform: "skewY(-30deg)",
            transformOrigin: "top left",
            opacity: isCompleted ? 0.9 : isActive ? 0.8 : 0.7,
          }}
        />

        <div
          className="absolute"
          style={{
            width: `${baseWidth}px`,
            height: `${depth}px`,
            left: "0",
            top: `${baseHeight}px`,
            background: isCompleted
              ? "linear-gradient(to right, #F59E0B, #FCD34D)"
              : isActive
              ? isDark
                ? "linear-gradient(to right, #30E680, #96BF48)"
                : "linear-gradient(to right, #6B9F4A, #5B8C3A)"
              : isDark
              ? "linear-gradient(to right, #232528, #1A1C1E)"
              : "linear-gradient(to right, #F3F4F6, #E5E7EB)",
            transform: "skewX(30deg)",
            transformOrigin: "top left",
            opacity: isCompleted ? 0.95 : isActive ? 0.85 : 0.75,
          }}
        />

        <div
          className="absolute border-2 rounded-lg flex flex-col items-center justify-center p-4"
          style={{
            width: `${baseWidth}px`,
            height: `${baseHeight}px`,
            background: isCompleted
              ? "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)"
              : isActive
              ? isDark
                ? "linear-gradient(135deg, #96BF48 0%, #30E680 100%)"
                : "linear-gradient(135deg, #5B8C3A 0%, #6B9F4A 100%)"
              : isDark
              ? "linear-gradient(135deg, #1A1C1E 0%, #2A2D30 100%)"
              : "linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)",
            borderColor: isCompleted
              ? "#FCD34D"
              : isActive
              ? isDark
                ? "#96BF48"
                : "#5B8C3A"
              : isDark
              ? "#2A2D30"
              : "#D2D2D7",
            boxShadow: isActive
              ? `0 8px 32px ${isDark ? "rgba(150, 191, 72, 0.4)" : "rgba(91, 140, 58, 0.3)"}`
              : "0 4px 16px rgba(0, 0, 0, 0.1)",
            transform: "skewX(-30deg) skewY(30deg)",
            transformOrigin: "center",
          }}
        >
          <div style={{ transform: "skewX(30deg) skewY(-30deg)" }}>
            {isLocked ? (
              <Lock className="w-8 h-8 text-text-muted mx-auto mb-2" />
            ) : isCompleted ? (
              <CheckCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            ) : (
              <div className="text-text-primary mb-2">{node.icon}</div>
            )}
          </div>

          <div style={{ transform: "skewX(30deg) skewY(-30deg)" }} className="text-center">
            <div className="text-xs text-text-secondary font-medium">Day {node.day}</div>
            <div
              className={`text-sm font-bold mt-1 ${
                isActive
                  ? "text-primary"
                  : isCompleted
                  ? "text-yellow-600"
                  : "text-text-primary"
              }`}
            >
              {node.name}
            </div>
            {isActive && (
              <motion.div
                className="text-xs text-primary font-bold mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                进行中
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Journey() {
  const [currentDay] = useState(5);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (theme === "dark" || resolvedTheme === "dark") : true;

  const getCityIcon = (day: number, type: "city" | "zone") => {
    if (type === "zone") {
      const zoneIcons = [Factory, Server, BarChart3, Factory, Server, BarChart3, Factory, Server];
      const Icon = zoneIcons[(day - 24) % zoneIcons.length];
      return <Icon className="w-8 h-8" />;
    }
    const icons: { [key: number]: React.ReactNode } = {
      1: <TreePine className="w-8 h-8" />,
      2: <Leaf className="w-8 h-8" />,
      3: <School className="w-8 h-8" />,
      4: <Cpu className="w-8 h-8" />,
      5: <Scale className="w-8 h-8" />,
    };
    return icons[day] || <Home className="w-8 h-8" />;
  };

  const cityNames: { [key: number]: string } = {
    1: "老龄化城",
    2: "环保城",
    3: "教育城",
    4: "科技城",
    5: "律法城",
  };

  const getCityName = (day: number) => {
    return cityNames[day] || `主题城 ${day}`;
  };

  const generateNodes = (): CityNode[] => {
    const nodes: CityNode[] = [];

    for (let i = 0; i < 31; i++) {
      const day = i + 1;
      const type = day <= 23 ? "city" : "zone";
      const status =
        day < currentDay
          ? "completed"
          : day === currentDay
          ? "active"
          : "locked";

      nodes.push({
        id: day,
        day,
        name: day <= 5 ? getCityName(day) : type === "city" ? `主题城 ${day}` : "工业区",
        type,
        status,
        icon: getCityIcon(day, type),
      });
    }

    return nodes;
  };

  const mapNodes = generateNodes();

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-text-primary mb-2">写作之旅</h1>
          <p className="text-text-secondary">探索31座主题城市，完成你的写作训练之旅</p>
        </motion.div>

        <BentoCard className="p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background" />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {Array.from({ length: 10 }).map((_, i) => (
                <ellipse
                  key={i}
                  cx={50}
                  cy={50}
                  rx={40 - i * 4}
                  ry={25 - i * 2.5}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-text-primary"
                />
              ))}
            </svg>
          </div>

          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2 z-0">
            <div
              className="h-full border-l-2 border-dashed"
              style={{
                borderColor: isDark ? "rgba(150, 191, 72, 0.3)" : "rgba(91, 140, 58, 0.2)",
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col gap-20 py-8">
            {mapNodes.map((node, index) => {
              const isLeft = node.day % 2 === 1;
              const isPathActive = node.status !== "locked";

              return (
                <div key={node.id} className="relative">
                  {index < mapNodes.length - 1 && (() => {
                    const direction = isLeft ? "left" : "right";
                    const color = isDark ? "rgba(150, 191, 72, 0.5)" : "rgba(91, 140, 58, 0.4)";
                    const gradient = isPathActive
                      ? `linear-gradient(to ${direction}, ${color}, transparent)`
                      : "transparent";
                    
                    return (
                      <div
                        className={`absolute top-1/2 w-1/2 h-0.5 ${
                          isLeft ? "left-1/2" : "right-1/2"
                        }`}
                        style={{
                          background: gradient,
                        }}
                      />
                    );
                  })()}

                  <div
                    className={`flex items-center ${
                      isLeft ? "justify-start flex-row" : "justify-end flex-row-reverse"
                    }`}
                  >
                    <div className="w-1/2" />
                    <div className="relative z-20">
                      <FloatingIsland node={node} isLeft={isLeft} isDark={isDark} />
                    </div>
                    <div className="w-1/2" />
                  </div>
                </div>
              );
            })}
          </div>
        </BentoCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <BentoCard>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg border-2 border-yellow-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">已完成</div>
                <div className="text-xs text-text-secondary">金色岛屿</div>
              </div>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative">
                <div
                  className="absolute inset-0 rounded-lg border-2"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, #96BF48 0%, #30E680 100%)"
                      : "linear-gradient(135deg, #5B8C3A 0%, #6B9F4A 100%)",
                    borderColor: isDark ? "#96BF48" : "#5B8C3A",
                    boxShadow: `0 4px 16px ${isDark ? "rgba(150, 191, 72, 0.4)" : "rgba(91, 140, 58, 0.3)"}`,
                  }}
                />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">进行中</div>
                <div className="text-xs text-text-secondary">荧光绿高亮</div>
              </div>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative opacity-40 grayscale">
                <div
                  className="absolute inset-0 rounded-lg border border-border"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, #1A1C1E 0%, #2A2D30 100%)"
                      : "linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)",
                  }}
                />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">已锁定</div>
                <div className="text-xs text-text-secondary">模糊效果</div>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}
