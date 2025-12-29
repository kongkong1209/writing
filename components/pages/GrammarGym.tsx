"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import FlipCard from "@/components/ui/FlipCard";
import BentoCard from "@/components/ui/BentoCard";
import { ArrowLeft, RotateCcw } from "lucide-react";

interface GrammarCard {
  id: number;
  chinese: string;
  english: string;
  explanation: string;
  category: string;
}

export default function GrammarGym() {
  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);

  // Mock data
  const grammarCards: GrammarCard[] = [
    {
      id: 1,
      chinese: "随着...的加剧，...变得越来越重要",
      english: "As ... intensifies, ... becomes increasingly important",
      explanation:
        "用于描述随着某个趋势或问题的发展，另一个现象的重要性逐渐增加。常用于开头段落引出话题。",
      category: "趋势描述",
    },
    {
      id: 2,
      chinese: "不仅...而且...",
      english: "Not only ... but also ...",
      explanation:
        "用于列举两个或多个相关的观点或事实，强调递进关系。注意倒装：Not only 放在句首时，主句需要部分倒装。",
      category: "并列结构",
    },
    {
      id: 3,
      chinese: "与其说...不如说...",
      english: "Rather than ..., it would be more accurate to say that ...",
      explanation:
        "用于纠正或重新表述一个观点，表示更准确的描述方式。常用于论证段落中澄清概念。",
      category: "对比表达",
    },
    {
      id: 4,
      chinese: "从长远来看，...",
      english: "In the long run, ...",
      explanation:
        "用于讨论长期影响或结果，强调时间维度的考量。常用于结论段落总结观点。",
      category: "时间表达",
    },
    {
      id: 5,
      chinese: "不可否认的是...",
      english: "It is undeniable that ...",
      explanation:
        "用于承认一个普遍认可的事实，然后在此基础上展开论述。常用于让步论证。",
      category: "让步表达",
    },
    {
      id: 6,
      chinese: "只有...才能...",
      english: "Only by ... can we ...",
      explanation:
        "用于强调必要条件，表示只有采取某种措施才能达到目标。注意倒装：Only 放在句首时，主句需要部分倒装。",
      category: "条件表达",
    },
  ];

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          <h1 className="text-xl font-bold text-text-primary">句型特训</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            核心句型练习
          </h2>
          <p className="text-text-secondary">
            点击卡片查看英文表达和详细解析，反复练习以掌握核心句型结构
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grammarCards.map((card, index) => (
            <motion.div
              key={`${card.id}-${resetKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-[280px]"
            >
              <FlipCard
                front={
                  <BentoCard className="h-full flex flex-col justify-center items-center text-center p-6">
                    <div className="text-xs text-primary mb-3 font-medium">
                      {card.category}
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-4">
                      {card.chinese}
                    </h3>
                    <div className="text-text-secondary text-sm">
                      点击卡片查看答案
                    </div>
                  </BentoCard>
                }
                back={
                  <BentoCard className="h-full flex flex-col justify-between p-6 bg-primary/10 border-primary/30">
                    <div>
                      <div className="text-xs text-primary mb-3 font-medium">
                        {card.category}
                      </div>
                      <h3 className="text-lg font-bold text-text-primary mb-4">
                        {card.english}
                      </h3>
                      <div className="text-text-secondary text-sm leading-relaxed">
                        {card.explanation}
                      </div>
                    </div>
                    <div className="text-xs text-text-muted mt-4 pt-4 border-t border-border">
                      再次点击可翻转回正面
                    </div>
                  </BentoCard>
                }
              />
            </motion.div>
          ))}
        </div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-6 py-3">
            <span className="text-text-secondary text-sm">
              已练习 {grammarCards.length} 个句型
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

