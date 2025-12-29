"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BentoCard from "@/components/ui/BentoCard";
import Button from "@/components/ui/Button";
import { FileText, Brain, Search, Upload, CheckCircle } from "lucide-react";

export default function AIStudio() {
  const [essayText, setEssayText] = useState("");
  const [gradingResult, setGradingResult] = useState<any>(null);
  const [abcValues, setAbcValues] = useState({ A: "", B: "", C: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleEssayGrade = () => {
    // Mock AI grading
    setGradingResult({
      overall: 7.5,
      taskResponse: 7.5,
      coherence: 8.0,
      lexicalResource: 7.0,
      grammar: 7.5,
      feedback: "文章结构清晰，逻辑连贯。建议增加更多具体例子来支撑论点。",
    });
  };

  const handleABCCheck = () => {
    // Mock ABC logic check
    alert("ABC 逻辑链检查完成！\nA: 现象识别 ✓\nB: 原因分析 ✓\nC: 解决方案 ✓");
  };

  const handleVocabSearch = () => {
    // Mock vocab search
    const mockResults = [
      { chunk: "demographic shift", meaning: "人口结构变化", example: "The demographic shift towards an aging population..." },
      { chunk: "pension system", meaning: "养老金制度", example: "Reform the pension system..." },
    ];
    setSearchResults(mockResults);
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
          <h1 className="text-4xl font-bold text-text-primary mb-2">AI 演练场</h1>
          <p className="text-text-secondary">使用 AI 工具提升你的写作能力</p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Essay Grader */}
          <BentoCard span="col-span-1" className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/20 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">作文评分器</h2>
                <p className="text-sm text-text-secondary">上传你的文章，获得 AI 评分和反馈</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  输入你的文章
                </label>
                <textarea
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="在这里粘贴你的雅思写作文章..."
                  className="w-full min-h-[200px] bg-background border border-border rounded-lg p-4
                             text-text-primary placeholder-text-muted
                             focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                             transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handleEssayGrade} disabled={!essayText.trim()}>
                  <Upload className="w-4 h-4 mr-2" />
                  开始评分
                </Button>
                {essayText && (
                  <span className="text-sm text-text-secondary">
                    字数: {essayText.length}
                  </span>
                )}
              </div>

              {gradingResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface border border-border rounded-lg p-6 mt-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-text-primary">评分结果</h3>
                    <div className="text-3xl font-bold text-primary">
                      {gradingResult.overall}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-text-secondary mb-1">任务回应</div>
                      <div className="text-lg font-bold text-text-primary">
                        {gradingResult.taskResponse}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary mb-1">连贯性</div>
                      <div className="text-lg font-bold text-text-primary">
                        {gradingResult.coherence}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary mb-1">词汇资源</div>
                      <div className="text-lg font-bold text-text-primary">
                        {gradingResult.lexicalResource}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary mb-1">语法</div>
                      <div className="text-lg font-bold text-text-primary">
                        {gradingResult.grammar}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium text-text-primary mb-2">AI 反馈</div>
                    <p className="text-sm text-text-secondary">{gradingResult.feedback}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </BentoCard>

          {/* Logic Lab */}
          <BentoCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">逻辑实验室</h2>
                <p className="text-sm text-text-secondary">练习 ABC 逻辑链</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  A - 现象/问题
                </label>
                <input
                  type="text"
                  value={abcValues.A}
                  onChange={(e) => setAbcValues({ ...abcValues, A: e.target.value })}
                  placeholder="例如：人口老龄化"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3
                             text-text-primary placeholder-text-muted
                             focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  B - 原因/影响
                </label>
                <input
                  type="text"
                  value={abcValues.B}
                  onChange={(e) => setAbcValues({ ...abcValues, B: e.target.value })}
                  placeholder="例如：导致劳动力短缺"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3
                             text-text-primary placeholder-text-muted
                             focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  C - 解决方案
                </label>
                <input
                  type="text"
                  value={abcValues.C}
                  onChange={(e) => setAbcValues({ ...abcValues, C: e.target.value })}
                  placeholder="例如：提高退休年龄"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3
                             text-text-primary placeholder-text-muted
                             focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button
                onClick={handleABCCheck}
                disabled={!abcValues.A || !abcValues.B || !abcValues.C}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                检查逻辑链
              </Button>
            </div>
          </BentoCard>

          {/* Vocab Hunter */}
          <BentoCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">词伙猎人</h2>
                <p className="text-sm text-text-secondary">按主题搜索词伙</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="输入主题，例如：老龄化、环保、教育..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-3
                             text-text-primary placeholder-text-muted
                             focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button onClick={handleVocabSearch} disabled={!searchQuery.trim()} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                搜索词伙
              </Button>

              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 mt-4"
                >
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="bg-surface border border-border rounded-lg p-4"
                    >
                      <div className="font-medium text-text-primary mb-1">
                        {result.chunk}
                      </div>
                      <div className="text-sm text-text-secondary mb-2">
                        {result.meaning}
                      </div>
                      <div className="text-xs text-text-muted italic">
                        {result.example}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}

