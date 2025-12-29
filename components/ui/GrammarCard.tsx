"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import BentoCard from "./BentoCard";
import { Check, RotateCcw, X, CheckCircle2 } from "lucide-react";

interface GrammarCardProps {
  chinese: string;
  english: string;
  explanation: string;
  className?: string;
}

export default function GrammarCard({
  chinese,
  english,
  explanation,
  className = "",
}: GrammarCardProps) {
  const [userInput, setUserInput] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCheck = () => {
    if (userInput.trim() && !isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleReset = () => {
    setUserInput("");
    setIsFlipped(false);
  };

  // Simple similarity calculation
  const calculateSimilarity = () => {
    const user = userInput.toLowerCase().trim();
    const correct = english.toLowerCase().trim();
    if (!user || !correct) return 0;

    // Simple word-based similarity
    const userWords = user.split(/\s+/);
    const correctWords = correct.split(/\s+/);
    const commonWords = userWords.filter((word) => correctWords.includes(word));
    return Math.round((commonWords.length / Math.max(userWords.length, correctWords.length)) * 100);
  };

  const similarity = calculateSimilarity();
  const isCorrect = userInput.toLowerCase().trim() === english.toLowerCase().trim();

  return (
    <div className={className}>
      <div className="relative perspective-1000" style={{ minHeight: "400px" }}>
        {/* Front Side - Input State */}
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -180, opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
              <BentoCard className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                      <span>中文句子</span>
                    </h4>
                    <p className="text-lg text-text-primary leading-relaxed bg-surface/50 rounded-lg p-4 border border-border">
                      {chinese}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">
                      请翻译成英文
                    </label>
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="在这里输入你的翻译..."
                      className="w-full min-h-[150px] bg-background border border-border rounded-lg p-4
                                 text-text-primary placeholder-text-muted
                                 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                                 transition-all duration-200 resize-none font-mono text-sm"
                      disabled={isFlipped}
                      autoFocus
                    />
                    <div className="text-xs text-text-secondary mt-2">
                      字数: {userInput.length}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={handleCheck}
                      disabled={!userInput.trim()}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      提交 / Check
                    </Button>
                  </div>

                  <div className="text-xs text-text-muted text-center pt-2 border-t border-border">
                    输入完成后点击"提交"查看答案
                  </div>
                </div>
              </BentoCard>
            </motion.div>
          ) : (
            // Back Side - Result State
            <motion.div
              key="back"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
              <BentoCard className="p-6 bg-primary/10 border-primary/30">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-primary flex items-center gap-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          标准答案
                        </>
                      ) : (
                        "标准答案"
                      )}
                    </h4>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Book's Answer */}
                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="text-xs text-text-secondary mb-2">标准答案</div>
                    <p className="text-lg text-text-primary leading-relaxed font-medium">
                      {english}
                    </p>
                    <div className="text-sm text-text-secondary leading-relaxed mt-3 pt-3 border-t border-border">
                      {explanation}
                    </div>
                  </div>

                  {/* User's Input Comparison */}
                  <div className="bg-surface border border-border rounded-lg p-4">
                    <div className="text-xs text-text-secondary mb-2 flex items-center justify-between">
                      <span>你的答案</span>
                      <span className={`font-medium ${isCorrect ? "text-primary" : "text-text-secondary"}`}>
                        相似度: {similarity}%
                      </span>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      isCorrect 
                        ? "bg-primary/10 border border-primary/30" 
                        : "bg-red-500/10 border border-red-500/30"
                    }`}>
                      <p className="text-base text-text-primary leading-relaxed font-mono">
                        {userInput || "(未输入)"}
                      </p>
                    </div>
                  </div>

                  {/* Visual Diff - Word Comparison */}
                  {!isCorrect && userInput.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-surface border border-border rounded-lg p-4"
                    >
                      <div className="text-xs text-text-secondary mb-3">词汇对比</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex flex-wrap gap-2">
                          {english.split(/\s+/).map((word, idx) => {
                            const userWords = userInput.toLowerCase().split(/\s+/);
                            const isMatch = userWords.includes(word.toLowerCase());
                            return (
                              <span
                                key={idx}
                                className={`px-2 py-1 rounded ${
                                  isMatch
                                    ? "bg-primary/20 text-primary border border-primary/30"
                                    : "bg-surface-hover text-text-secondary border border-border"
                                }`}
                              >
                                {word}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* AI Feedback Placeholder */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-surface border border-border rounded-lg p-4"
                  >
                    <div className="text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                      <span>AI 反馈</span>
                      <span className="text-xs text-text-muted font-normal">(模拟)</span>
                    </div>
                    <div className="text-sm text-text-secondary space-y-2">
                      {isCorrect ? (
                        <p className="text-primary font-medium">
                          ✓ 翻译准确，语法正确。很好地掌握了这个句型结构。
                        </p>
                      ) : (
                        <>
                          <p>
                            {similarity > 70
                              ? "✓ 整体翻译不错，但有一些细节需要改进："
                              : "建议从以下几个方面改进："}
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-xs text-text-muted ml-2">
                            <li>检查时态和语态的使用</li>
                            <li>注意词汇的准确性和地道表达</li>
                            <li>确保句子结构完整</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </motion.div>

                  <div className="flex justify-center pt-2">
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      重新练习
                    </Button>
                  </div>
                </div>
              </BentoCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
