"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BentoCard from "@/components/ui/BentoCard";
import ProgressRing from "@/components/ui/ProgressRing";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import Timeline from "@/components/ui/Timeline";
import { Flame, BookOpen, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [currentDay] = useState(5);
  const [progress] = useState(65);
  const [streakDays] = useState(12);
  const [wordCount] = useState(156);

  // Mock timeline data
  const timelineItems = Array.from({ length: 31 }, (_, i) => ({
    id: i + 1,
    day: i + 1,
    title: i < 23 ? "大作文" : "小作文",
    type: i < 23 ? ("essay" as const) : ("letter" as const),
    status:
      i + 1 < currentDay
        ? ("completed" as const)
        : i + 1 === currentDay
        ? ("current" as const)
        : ("locked" as const),
  }));

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            手把手带你练写作
          </h1>
          <p className="text-text-secondary">Gu's Method · 雅思写作训练平台</p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Progress Card - Large */}
          <BentoCard
            span="col-span-1 md:col-span-2"
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex-1">
              <div className="text-text-secondary text-sm mb-2">今日训练</div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Day {currentDay}: 刑罚
              </h2>
              <p className="text-text-secondary mb-6">
                通过逻辑训练和词伙练习，掌握"刑罚"主题的写作技巧
              </p>
              <Button
                size="lg"
                onClick={() => router.push("/daily-practice")}
                className="flex items-center gap-2"
              >
                开始训练
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <ProgressRing progress={progress} size={140} />
          </BentoCard>

          {/* Stats */}
          <BentoCard>
            <StatCard
              label="连续打卡"
              value={streakDays}
              icon={<Flame className="w-5 h-5" />}
              trend="up"
            />
          </BentoCard>

          <BentoCard>
            <StatCard
              label="词伙掌握"
              value={wordCount}
              icon={<BookOpen className="w-5 h-5" />}
              trend="up"
            />
          </BentoCard>

          {/* Timeline Card - Full Width */}
          <BentoCard span="col-span-1 md:col-span-2 lg:col-span-4" className="overflow-hidden">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-text-primary mb-1">学习路线</h3>
              <p className="text-text-secondary text-sm">
                31天完整训练计划 · Day 1-23 大作文 · Day 24-31 小作文
              </p>
            </div>
            <Timeline
              items={timelineItems}
              onItemClick={(item) => {
                if (item.status === "current") {
                  router.push("/daily-practice");
                }
              }}
            />
          </BentoCard>

          {/* Quick Actions */}
          <BentoCard
            span="col-span-1 md:col-span-2"
            onClick={() => router.push("/grammar-gym")}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">句型特训</h3>
                <p className="text-text-secondary text-sm">
                  通过翻转卡片练习，掌握核心句型结构
                </p>
              </div>
              <div className="text-primary">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </BentoCard>

          {/* Recent Activity */}
          <BentoCard span="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-text-primary mb-4">最近完成</h3>
            <div className="space-y-3">
              {[
                { day: 4, title: "老龄化", status: "已完成" },
                { day: 3, title: "教育", status: "已完成" },
                { day: 2, title: "环保", status: "已完成" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 bg-surface-hover rounded-lg border border-border"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div>
                    <div className="text-text-primary font-medium">
                      Day {item.day}: {item.title}
                    </div>
                    <div className="text-text-muted text-sm">{item.status}</div>
                  </div>
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </motion.div>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}

