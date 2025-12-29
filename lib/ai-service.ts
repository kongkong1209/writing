export interface CheckAnswerResponse {
  score: number;
  feedback: string;
  diff: Array<{
    word: string;
    status: "correct" | "wrong" | "missing";
  }>;
}

export interface GenerateQuestionResponse {
  chinese: string;
  standardEnglish: string;
  explanation: string;
}

export interface CheckAnswerRequest {
  userAnswer: string;
  standardAnswer: string;
  context?: string;
}

export interface GenerateQuestionRequest {
  currentChinese: string;
  currentEnglish: string;
  topic?: string;
}

/**
 * Check user's answer against the standard answer using AI
 * @param userAnswer - The user's translation
 * @param standardAnswer - The model answer from the book
 * @param context - Optional context/topic for better AI analysis
 * @returns Promise with score, feedback, and word-by-word diff
 */
export async function checkAnswerWithAI(
  userAnswer: string,
  standardAnswer: string,
  context?: string
): Promise<CheckAnswerResponse> {
  try {
    const res = await fetch("/api/check-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAnswer,
        standardAnswer,
        context,
      }),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();

    // Handle error response
    if (data.error) {
      console.error("API Error:", data.error);
      return {
        score: 0,
        feedback: data.message || "AI Service Unavailable",
        diff: [],
      };
    }

    return data as CheckAnswerResponse;
  } catch (error) {
    console.error("AI Check Failed:", error);
    // Return mock error data
    return {
      score: 0,
      feedback: "AI Service Unavailable. Please check your connection.",
      diff: [],
    };
  }
}

/**
 * Generate a similar practice question using the same grammatical structure
 * @param currentChinese - The current Chinese sentence
 * @param currentEnglish - The current English sentence
 * @param topic - Optional topic for the new question
 * @returns Promise with new Chinese-English pair and explanation
 */
export async function generateSimilarQuestion(
  currentChinese: string,
  currentEnglish: string,
  topic?: string
): Promise<GenerateQuestionResponse> {
  try {
    const res = await fetch("/api/generate-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentChinese,
        currentEnglish,
        topic,
      }),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();

    // Handle error response
    if (data.error) {
      console.error("API Error:", data.error);
      return {
        chinese: "生成失败，请稍后重试。",
        standardEnglish: "Failed to generate question. Please try again later.",
        explanation: "AI service unavailable.",
      };
    }

    return data as GenerateQuestionResponse;
  } catch (error) {
    console.error("Generate Question Failed:", error);
    // Return mock error data
    return {
      chinese: "生成失败，请稍后重试。",
      standardEnglish: "Failed to generate question. Please try again later.",
      explanation: "AI service unavailable.",
    };
  }
}

/**
 * Calculate similarity score between two sentences (simple word-based)
 * This is a fallback when AI is not available
 */
export function calculateSimilarity(userAnswer: string, standardAnswer: string): number {
  const user = userAnswer.toLowerCase().trim();
  const standard = standardAnswer.toLowerCase().trim();

  if (!user || !standard) return 0;

  const userWords = user.split(/\s+/);
  const standardWords = standard.split(/\s+/);
  const commonWords = userWords.filter((word) => standardWords.includes(word));

  return Math.round((commonWords.length / Math.max(userWords.length, standardWords.length)) * 100);
}

