"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import BentoCard from "./BentoCard";
import { Check, RotateCcw, CheckCircle2, Loader2, Sparkles, Wand2 } from "lucide-react";
import { checkAnswerWithAI, generateSimilarQuestion } from "@/lib/ai-service";

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
  // Internal state for current question (can be updated by "Generate Similar")
  const [currentChinese, setCurrentChinese] = useState(chinese);
  const [currentEnglish, setCurrentEnglish] = useState(english);
  const [currentExplanation, setCurrentExplanation] = useState(explanation);

  // Sync with props when they change
  useEffect(() => {
    setCurrentChinese(chinese);
    setCurrentEnglish(english);
    setCurrentExplanation(explanation);
  }, [chinese, english, explanation]);

  const [userInput, setUserInput] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Response State
  const [aiResult, setAiResult] = useState<{
    score: number;
    feedback: string;
    diff: Array<{
      word: string;
      status: "correct" | "wrong" | "missing";
    }>;
  } | null>(null);

  const handleCheck = async () => {
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);

    try {
      // Call the AI API
      const result = await checkAnswerWithAI(userInput, currentEnglish, currentExplanation);
      setAiResult(result);
      setIsFlipped(true);
    } catch (error) {
      console.error("Error checking answer:", error);
      // Fallback to simple comparison if AI fails
      const userLower = userInput.toLowerCase().trim();
      const englishLower = currentEnglish.toLowerCase().trim();
      const isCorrect = userLower === englishLower;
      
      setAiResult({
        score: isCorrect ? 100 : 50,
        feedback: isCorrect
          ? "Your translation matches the model answer perfectly!"
          : "Your translation needs improvement. Compare it with the model answer above.",
        diff: [],
      });
      setIsFlipped(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUserInput("");
    setIsFlipped(false);
    setAiResult(null);
  };

  const handleGenerateSimilar = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      // Extract topic from current question (simple extraction)
      const topic = currentExplanation || "IELTS Writing";
      
      // Call the generate API
      const newQuestion = await generateSimilarQuestion(
        currentChinese,
        currentEnglish,
        topic
      );

      if (newQuestion) {
        // Update the current question
        setCurrentChinese(newQuestion.chinese);
        setCurrentEnglish(newQuestion.standardEnglish);
        setCurrentExplanation(newQuestion.explanation || currentExplanation);
        
        // Reset the card to input state
        setUserInput("");
        setIsFlipped(false);
        setAiResult(null);
      }
    } catch (error) {
      console.error("Error generating similar question:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const score = aiResult?.score || 0;
  const isCorrect = score >= 90;

  return (
    <div className={className}>
      <div className="relative perspective-1000" style={{ minHeight: "450px" }}>
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
              <BentoCard className="p-6 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                      <span>中文句子</span>
                    </h4>
                    <p className="text-lg text-text-primary leading-relaxed bg-surface/50 rounded-lg p-4 border border-border">
                      {currentChinese}
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
                      disabled={isLoading}
                      autoFocus
                    />
                    <div className="text-xs text-text-secondary mt-2">
                      字数: {userInput.length}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={handleCheck}
                      disabled={!userInput.trim() || isLoading}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          AI 分析中...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          提交 / Check with AI
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-xs text-text-muted text-center pt-2 border-t border-border">
                    {isLoading
                      ? "AI 正在分析你的答案..."
                      : '输入完成后点击"提交"查看 AI 反馈'}
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
              <BentoCard className="p-6 bg-primary/10 border-primary/30 h-full">
                <div className="space-y-5">
                  {/* Header: Score */}
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`text-3xl font-bold ${
                          score >= 80 ? "text-primary" : score >= 60 ? "text-yellow-500" : "text-red-500"
                        }`}
                      >
                        {score}
                      </div>
                      <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                        匹配分数
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Standard Answer */}
                  <div>
                    <div className="text-xs text-primary font-bold uppercase mb-2 flex items-center gap-2">
                      {isCorrect && <CheckCircle2 className="w-3 h-3" />}
                      标准答案
                    </div>
                    <p className="text-lg text-text-primary leading-relaxed font-medium bg-background border border-border rounded-lg p-4">
                      {currentEnglish}
                    </p>
                    <div className="text-sm text-text-secondary leading-relaxed mt-3 pt-3 border-t border-border">
                      {currentExplanation}
                    </div>
                  </div>

                  {/* User's Answer */}
                  <div className="bg-surface border border-border rounded-lg p-4">
                    <div className="text-xs text-text-secondary mb-2">你的答案</div>
                    <div
                      className={`p-3 rounded-lg ${
                        isCorrect
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-red-500/10 border border-red-500/30"
                      }`}
                    >
                      <p className="text-base text-text-primary leading-relaxed font-mono">
                        {userInput || "(未输入)"}
                      </p>
                    </div>
                  </div>

                  {/* AI Feedback Box */}
                  {aiResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-primary/5 border border-primary/20 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-primary">AI 教练反馈</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                        {aiResult.feedback || "No feedback available."}
                      </p>
                    </motion.div>
                  )}

                  {/* Word-by-word Diff */}
                  {aiResult?.diff && aiResult.diff.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-surface border border-border rounded-lg p-4"
                    >
                      <div className="text-xs text-text-secondary mb-3">词汇对比</div>
                      <div className="flex flex-wrap gap-2">
                        {aiResult.diff.map((item, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-sm ${
                              item.status === "correct"
                                ? "bg-primary/20 text-primary border border-primary/30"
                                : item.status === "wrong"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-surface-hover text-text-secondary border border-border opacity-50"
                            }`}
                          >
                            {item.word}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2">
                    <Button
                      onClick={handleGenerateSimilar}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          AI 生成中...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          练习相似题目 / Practice Similar Question
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="secondary"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      重新练习当前题目
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
