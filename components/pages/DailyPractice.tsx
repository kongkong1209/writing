"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import InputGroup from "@/components/ui/InputGroup";
import WordCapsule from "@/components/ui/WordCapsule";
import { ArrowLeft, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

export default function DailyPractice() {
  const router = useRouter();
  const [showBackground, setShowBackground] = useState(false);
  const [abcValues, setAbcValues] = useState({ A: "", B: "", C: "" });
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [writingContent, setWritingContent] = useState("");

  // Mock data
  const topic = "老龄化";
  const backgroundInfo = `老龄化（Ageing）是当前社会面临的重要挑战。随着医疗技术的进步和生活水平的提高，人口老龄化趋势日益明显。这带来了劳动力短缺、养老金压力、医疗资源紧张等问题。在雅思写作中，我们需要从多个角度分析老龄化问题，包括经济影响、社会影响和解决方案。`;

  const wordOptions = [
    "demographic shift",
    "pension system",
    "healthcare burden",
    "labor shortage",
    "intergenerational support",
    "retirement age",
    "elderly care",
    "social security",
  ];

  const sentence = "随着人口老龄化加剧，政府需要改革养老金制度以应对未来的财政压力。";

  const handleWordClick = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          <h1 className="text-xl font-bold text-text-primary">Day 5: {topic}</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
        {/* Background Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-card p-6"
        >
          <button
            onClick={() => setShowBackground(!showBackground)}
            className="w-full flex items-center justify-between text-left"
          >
            <h2 className="text-lg font-bold text-text-primary">背景知识</h2>
            {showBackground ? (
              <ChevronUp className="w-5 h-5 text-text-secondary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-text-secondary" />
            )}
          </button>
          <AnimatePresence>
            {showBackground && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-text-secondary mt-4 leading-relaxed">
                  {backgroundInfo}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Section A: ABC Logic */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Section A: 逻辑训练 (ABC Logic)
          </h2>
          <div className="space-y-6">
            <InputGroup
              label="A - 现象/问题 (What)"
              placeholder="例如：人口老龄化加剧"
              value={abcValues.A}
              onChange={(value) => setAbcValues({ ...abcValues, A: value })}
            />
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-primary rotate-90" />
            </div>
            <InputGroup
              label="B - 原因/影响 (Why)"
              placeholder="例如：导致劳动力短缺"
              value={abcValues.B}
              onChange={(value) => setAbcValues({ ...abcValues, B: value })}
            />
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-primary rotate-90" />
            </div>
            <InputGroup
              label="C - 解决方案 (How)"
              placeholder="例如：提高退休年龄"
              value={abcValues.C}
              onChange={(value) => setAbcValues({ ...abcValues, C: value })}
            />
          </div>
        </motion.section>

        {/* Section B: Word Fill */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Section B: 词伙填空
          </h2>
          <div className="bg-surface border border-border rounded-card p-6 mb-6">
            <p className="text-lg text-text-primary mb-4">{sentence}</p>
            <div className="text-text-secondary text-sm">
              请从下方选择正确的词伙填入空白处
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {wordOptions.map((word, index) => (
              <WordCapsule
                key={index}
                word={word}
                selected={selectedWords.includes(word)}
                onClick={() => handleWordClick(word)}
              />
            ))}
          </div>
        </motion.section>

        {/* Section C: Writing Area */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Section C: 写作区
          </h2>
          <div className="bg-surface border border-border rounded-card p-6">
            <textarea
              value={writingContent}
              onChange={(e) => setWritingContent(e.target.value)}
              placeholder="在这里开始你的写作练习..."
              className="w-full min-h-[300px] bg-background border border-border rounded-lg p-4
                         text-text-primary placeholder-text-muted
                         focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                         transition-all duration-200 resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="text-text-secondary text-sm">
                字数: {writingContent.length}
              </div>
              <Button
                onClick={() => {
                  // Mock submit
                  alert("提交成功！（这是演示版本）");
                }}
              >
                提交练习
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-border">
          <Button variant="ghost" onClick={() => router.push("/")}>
            上一题
          </Button>
          <Button onClick={() => router.push("/grammar-gym")}>
            前往句型特训
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

