"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import BentoCard from "./BentoCard";
import { Check, RotateCcw, Loader2, Sparkles, Flame, Trophy, ArrowRight } from "lucide-react";
import { checkAnswerWithAI, generateSimilarQuestion } from "@/lib/ai-service";

interface GrammarCardProps {
  chinese: string;
  english: string;
  explanation: string;
  className?: string;
  onPass?: () => void; // Parent callback when mastered
}

export default function GrammarCard({
  chinese: initialChinese,
  english: initialEnglish,
  explanation: initialExplanation,
  className = "",
  onPass,
}: GrammarCardProps) {
  // Content State (Dynamic for Practice Loop)
  const [content, setContent] = useState({
    chinese: initialChinese,
    english: initialEnglish,
    explanation: initialExplanation,
  });

  // Sync with props when they change
  useEffect(() => {
    setContent({
      chinese: initialChinese,
      english: initialEnglish,
      explanation: initialExplanation,
    });
  }, [initialChinese, initialEnglish, initialExplanation]);

  const [userInput, setUserInput] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Game State - Streak Mastery Logic
  const [streak, setStreak] = useState(0);
  const TARGET_STREAK = 3;
  const [isMastered, setIsMastered] = useState(false);

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
      const result = await checkAnswerWithAI(userInput, content.english, content.explanation);
      setAiResult(result);

      // Streak Logic
      if (result.score >= 80) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak >= TARGET_STREAK) {
          setIsMastered(true);
        }
      } else {
        // Reset streak on failure
        setStreak(0);
        setIsMastered(false);
      }

      setIsFlipped(true);
    } catch (error) {
      console.error("Error checking answer:", error);
      // Fallback to simple comparison if AI fails
      const userLower = userInput.toLowerCase().trim();
      const englishLower = content.english.toLowerCase().trim();
      const isCorrect = userLower === englishLower;
      const fallbackScore = isCorrect ? 100 : 50;

      setAiResult({
        score: fallbackScore,
        feedback: isCorrect
          ? "Your translation matches the model answer perfectly!"
          : "Your translation needs improvement. Compare it with the model answer above.",
        diff: [],
      });

      // Streak Logic for fallback
      if (fallbackScore >= 80) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak >= TARGET_STREAK) {
          setIsMastered(true);
        }
      } else {
        setStreak(0);
        setIsMastered(false);
      }

      setIsFlipped(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    // If mastered, trigger Pass callback
    if (isMastered) {
      if (onPass) {
        onPass();
      }
      return;
    }

    // Otherwise, Generate Similar Question
    setIsGenerating(true);
    try {
      const topic = content.explanation || "IELTS Writing";
      const newQuestion = await generateSimilarQuestion(
        content.chinese,
        content.english,
        topic
      );

      if (newQuestion) {
        // Update the current question
        setContent({
          chinese: newQuestion.chinese,
          english: newQuestion.standardEnglish,
          explanation: newQuestion.explanation || content.explanation,
        });

        // Reset the card to input state (but keep streak!)
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

  const handleReset = () => {
    setUserInput("");
    setIsFlipped(false);
    setAiResult(null);
    // Note: We keep streak and isMastered on reset (user can continue practicing)
  };

  const score = aiResult?.score || 0;
  const isPassingScore = score >= 80;

  return (
    <div className={className}>
      <div className="relative perspective-1000" style={{ minHeight: "500px" }}>
        {/* Mastery Progress Header (Visible on both sides) */}
        <div className="absolute -top-14 left-0 right-0 flex flex-col items-center gap-2 mb-4">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            掌握进度 / Mastery Streak
          </span>
          <div className="flex items-center gap-2">
            {[...Array(TARGET_STREAK)].map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  scale: i < streak ? [1, 1.2, 1] : 1,
                  opacity: i < streak ? 1 : 0.4,
                }}
                transition={{
                  scale: { duration: 0.3, delay: i * 0.1 },
                }}
                className="transition-colors"
              >
                <Flame
                  className={`w-6 h-6 ${
                    i < streak
                      ? "text-orange-500 fill-orange-500"
                      : "text-text-muted fill-text-muted"
                  }`}
                />
              </motion.div>
            ))}
            <span className="text-sm font-bold text-text-primary ml-2">
              ({streak}/{TARGET_STREAK})
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isFlipped ? (
            // Front Side - Input State
            <motion.div
              key="front"
              initial={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -180, opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
              className="h-full"
            >
              <BentoCard className="p-6 h-full flex flex-col justify-between min-h-[450px]">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                      <span>中文句子</span>
                      {streak > 0 && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                          连击 {streak}
                        </span>
                      )}
                    </h4>
                    <p className="text-lg text-text-primary leading-relaxed bg-surface/50 rounded-lg p-4 border border-border">
                      {content.chinese}
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
                      : `需要连续 ${TARGET_STREAK} 次得分 ≥80 才能通过`}
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
              className="h-full"
            >
              <BentoCard
                className={`p-6 h-full flex flex-col justify-between min-h-[450px] border-2 ${
                  isPassingScore
                    ? "bg-primary/10 border-primary/50"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="space-y-5">
                  {/* Result Header */}
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`text-4xl font-black ${
                          isPassingScore
                            ? "text-primary"
                            : score >= 60
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {score}
                      </div>
                      <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                        AI 评分
                      </div>
                    </div>

                    {/* Streak Feedback */}
                    <div className="text-right">
                      {isPassingScore ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 text-orange-400 font-bold"
                        >
                          <Flame className="w-5 h-5 fill-orange-400" />
                          <span>连击 +1</span>
                        </motion.div>
                      ) : (
                        <div className="text-red-400 font-bold text-sm">
                          连击重置 😢
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mastery Status */}
                  {isMastered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-xl p-4 text-center"
                    >
                      <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-lg font-bold text-yellow-400">
                        🎉 恭喜！已掌握此关卡！
                      </div>
                      <div className="text-sm text-text-secondary mt-1">
                        连续 {TARGET_STREAK} 次得分 ≥80
                      </div>
                    </motion.div>
                  )}

                  {/* Standard Answer */}
                  <div>
                    <div className="text-xs text-primary font-bold uppercase mb-2 flex items-center gap-2">
                      标准答案
                    </div>
                    <p className="text-lg text-text-primary leading-relaxed font-medium bg-background border border-border rounded-lg p-4">
                      {content.english}
                    </p>
                    <div className="text-sm text-text-secondary leading-relaxed mt-3 pt-3 border-t border-border">
                      {content.explanation}
                    </div>
                  </div>

                  {/* User's Answer */}
                  <div className="bg-surface border border-border rounded-lg p-4">
                    <div className="text-xs text-text-secondary mb-2">你的答案</div>
                    <div
                      className={`p-3 rounded-lg ${
                        isPassingScore
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
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  {isMastered ? (
                    <Button
                      onClick={handleNextQuestion}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 text-lg shadow-[0_0_20px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2"
                    >
                      <Trophy className="w-6 h-6" />
                      完成关卡 / Complete Level
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleNextQuestion}
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
                            <Sparkles className="w-4 h-4" />
                            {isPassingScore
                              ? "保持连击！下一题"
                              : "再试一次 / Try Another One"}
                            <ArrowRight className="w-4 h-4" />
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
                    </>
                  )}
                </div>
              </BentoCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
