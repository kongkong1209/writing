"use client";

import { useParams, useRouter } from "next/navigation";
import { levelsData } from "@/lib/levels";
import GrammarCard from "@/components/ui/GrammarCard";
import Button from "@/components/ui/Button";
import { ArrowLeft, BookOpen, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const level = levelsData[id];

  if (!level) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0B0C0E] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Level Not Found</h1>
          <Button onClick={() => router.push("/journey")}>Back to Map</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0C0E] text-gray-900 dark:text-white py-10 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/journey")}
            className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-green-600 dark:text-[#96BF48]">Day {level.id}</span>
              <span className="text-gray-400">|</span>
              {level.title}
            </h1>
          </div>
        </div>

        {/* Section A: The Book's Wisdom (Briefing) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Knowledge Card */}
          <div className="bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-white/5 rounded-2xl p-6 transition-colors">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-600 dark:text-[#96BF48]">
              <BookOpen className="w-5 h-5" />
              Key Points
            </h2>
            <ul className="space-y-3">
              {level.learningPoints.map((point, idx) => (
                <li key={idx} className="flex gap-3 text-gray-600 dark:text-gray-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-[#96BF48] mt-2 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Vocab Card */}
          <div className="bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-white/5 rounded-2xl p-6 transition-colors">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-500 dark:text-blue-400">
              <Lightbulb className="w-5 h-5" />
              Core Vocab
            </h2>
            <div className="flex flex-wrap gap-2">
              {level.vocab.map((word, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 rounded-lg text-sm"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Section B: The Challenge (Practice) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Practical Challenge</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Translate the sentence using the vocab above.
            </p>
          </div>

          <GrammarCard
            chinese={level.challenge.chinese}
            english={level.challenge.standardEnglish}
            explanation={level.challenge.tips}
          />
        </motion.div>
      </div>
    </div>
  );
}

