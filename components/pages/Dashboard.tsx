"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BentoCard from "@/components/ui/BentoCard";
import ProgressRing from "@/components/ui/ProgressRing";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import GrammarCard from "@/components/ui/GrammarCard";
import { Flame, Brain, ArrowRight, Quote } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [currentDay] = useState(5);
  const [progress] = useState(65);
  const [vocabMastery] = useState(156);
  const [logicScore] = useState(82);

  // Mock daily quote
  const dailyQuote = {
    chinese: "随着人口老龄化加剧，政府需要改革养老金制度以应对未来的财政压力。",
    english: "As the population ages, governments need to reform pension systems to address future fiscal pressures.",
    source: "Day 4: 老龄化",
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
          <h1 className="text-4xl font-bold text-text-primary mb-2">首页</h1>
          <p className="text-text-secondary">欢迎回来，继续你的写作之旅</p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Mission Card - Large */}
          <BentoCard
            span="col-span-2"
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex-1">
              <div className="text-text-secondary text-sm mb-2">当前任务</div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Day {currentDay}: 律法城 (Crime)
              </h2>
              <p className="text-text-secondary mb-6">
                探索犯罪与刑罚主题，掌握相关词汇和逻辑结构，完成今日写作训练
              </p>
              <Button
                size="lg"
                onClick={() => router.push("/journey")}
                className="flex items-center gap-2"
              >
                前往律法城
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <ProgressRing progress={progress} size={140} />
          </BentoCard>

          {/* Stats */}
          <BentoCard>
            <StatCard
              label="词伙掌握"
              value={vocabMastery}
              icon={<Flame className="w-5 h-5" />}
              trend="up"
            />
          </BentoCard>

          <BentoCard>
            <StatCard
              label="逻辑得分"
              value={logicScore}
              icon={<Brain className="w-5 h-5" />}
              trend="up"
            />
          </BentoCard>

          {/* Daily Quote Card */}
          <BentoCard span="col-span-3">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Quote className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-text-primary">每日金句</h3>
                  <span className="text-xs text-text-secondary">{dailyQuote.source}</span>
                </div>
                <GrammarCard
                  chinese={dailyQuote.chinese}
                  english={dailyQuote.english}
                  explanation="这是一个典型的'随着...加剧，...需要...'的句型结构，用于描述趋势和应对措施。"
                />
              </div>
            </div>
          </BentoCard>

          {/* Quick Actions */}
          <BentoCard
            span="col-span-2"
            onClick={() => router.push("/studio")}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">AI 演练场</h3>
                <p className="text-text-secondary text-sm">
                  使用 AI 工具进行写作练习和评分
                </p>
              </div>
              <div className="text-primary">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </BentoCard>

          {/* Recent Progress */}
          <BentoCard span="col-span-2">
            <h3 className="text-lg font-bold text-text-primary mb-4">最近完成</h3>
            <div className="space-y-3">
              {[
                { day: 4, title: "老龄化", status: "已完成", score: 85 },
                { day: 3, title: "教育", status: "已完成", score: 78 },
                { day: 2, title: "环保", status: "已完成", score: 82 },
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
                    <div className="text-text-muted text-sm">
                      {item.status} · 得分: {item.score}
                    </div>
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
