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
  onPass?: () => void;
}

export default function GrammarCard({
  chinese: initialChinese,
  english: initialEnglish,
  explanation: initialExplanation,
  className = "",
  onPass,
}: GrammarCardProps) {
  // Content State
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

  // Game State
  const [streak, setStreak] = useState(0);
  const TARGET_STREAK = 3;
  const [isMastered, setIsMastered] = useState(false);

  // AI Result
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
      // Call AI
      const result = await checkAnswerWithAI(userInput, content.english, content.explanation);
      setAiResult(result);

      // Streak Logic
      if (result.score >= 80) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak >= TARGET_STREAK) setIsMastered(true);
      } else {
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
        if (newStreak >= TARGET_STREAK) setIsMastered(true);
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
    if (isMastered) {
      if (onPass) onPass();
      return;
    }

    setIsGenerating(true);
    try {
      const topic = content.explanation || "IELTS Writing";
      const newQ = await generateSimilarQuestion(content.chinese, content.english, topic);

      if (newQ) {
        setContent({
          chinese: newQ.chinese,
          english: newQ.standardEnglish,
          explanation: newQ.explanation || content.explanation,
        });
        setUserInput("");
        setAiResult(null);
        setIsFlipped(false);
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
    // Note: We keep streak and isMastered on reset
  };

  const score = aiResult?.score || 0;
  const isPassingScore = score >= 80;

  return (
    <div className={className}>
      <div className="relative perspective-1000" style={{ minHeight: "500px" }}>
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            // ================= FRONT SIDE =================
            <motion.div
              key="front"
              initial={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -180, opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
              className="h-full"
            >
              <BentoCard className="p-6 h-full flex flex-col justify-between min-h-[500px]">
                <div className="space-y-6">
                  {/* HEADER: Title + Streak Icons (Integrated) */}
                  <div className="flex justify-between items-start border-b border-border pb-4">
                    <div>
                      <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                        Current Challenge
                      </h4>
                      <p className="text-xs text-text-muted mt-1">
                        Translate to clear the level ({streak}/{TARGET_STREAK})
                      </p>
                    </div>
                    {/* The Flames are now INSIDE the card, aligned to the right */}
                    <div className="flex gap-1 bg-surface/50 p-2 rounded-lg border border-border">
                      {[...Array(TARGET_STREAK)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: i < streak ? 1.1 : 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Flame
                            className={`w-5 h-5 ${
                              i < streak
                                ? "fill-orange-500 text-orange-500"
                                : "text-text-muted fill-text-muted"
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* QUESTION CONTENT */}
                  <div>
                    <p className="text-xl font-medium text-text-primary leading-relaxed">
                      {content.chinese}
                    </p>
                  </div>

                  {/* INPUT AREA */}
                  <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">
                      请翻译成英文
                    </label>
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="在这里输入你的翻译..."
                      className="w-full h-32 bg-background border border-border rounded-xl p-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      disabled={isLoading}
                      autoFocus
                    />
                    <div className="text-xs text-text-secondary mt-2">
                      字数: {userInput.length}
                    </div>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-4">
                  <Button
                    onClick={handleCheck}
                    disabled={!userInput.trim() || isLoading}
                    className="w-full py-4 bg-primary hover:bg-primary-hover text-black font-bold flex justify-center items-center gap-2 text-base transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        AI 分析中...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        提交 / Submit Answer
                      </>
                    )}
                  </Button>
                  <div className="text-xs text-text-muted text-center mt-2 pt-2 border-t border-border">
                    需要连续 {TARGET_STREAK} 次得分 ≥80 才能通过
                  </div>
                </div>
              </BentoCard>
            </motion.div>
          ) : (
            // ================= BACK SIDE =================
            <motion.div
              key="back"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
              className="h-full"
            >
              <BentoCard
                className={`p-6 h-full flex flex-col justify-between min-h-[500px] border-2 ${
                  isPassingScore
                    ? "bg-primary/10 border-primary/50"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="space-y-6">
                  {/* RESULT HEADER */}
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <div
                        className={`text-5xl font-black ${
                          isPassingScore
                            ? "text-primary"
                            : score >= 60
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {score}
                      </div>
                      <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mt-1">
                        AI 评分
                      </div>
                    </div>

                    <div className="text-right">
                      {isPassingScore ? (
                        <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                          <div className="flex items-center gap-1 text-primary font-bold">
                            <Flame className="w-4 h-4 fill-primary" /> +1 连击
                          </div>
                        </div>
                      ) : (
                        <div className="bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                          <div className="text-red-400 font-bold text-sm">连击重置 😢</div>
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

                  {/* STANDARD ANSWER */}
                  <div className="bg-background/50 p-4 rounded-xl border border-border">
                    <div className="text-xs text-primary font-bold uppercase tracking-wider mb-2">
                      标准答案
                    </div>
                    <div className="text-primary font-medium leading-relaxed">{content.english}</div>
                    <div className="text-sm text-text-secondary leading-relaxed mt-3 pt-3 border-t border-border">
                      {content.explanation}
                    </div>
                  </div>

                  {/* USER'S ANSWER */}
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

                  {/* FEEDBACK */}
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

                {/* FOOTER ACTIONS */}
                <div className="pt-4 space-y-2">
                  {isMastered ? (
                    <Button
                      onClick={handleNextQuestion}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 text-lg shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                      <Trophy className="w-6 h-6" />
                      完成关卡 / Complete Level
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleNextQuestion}
                        disabled={isGenerating}
                        className="w-full border border-border hover:bg-surface-hover hover:border-primary/50 py-4 text-text-secondary hover:text-text-primary transition-all flex items-center justify-center gap-2"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="animate-spin w-4 h-4" />
                            AI 生成中...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            {isPassingScore ? "保持连击！下一题" : "再试一次 / Try Another One"}
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
