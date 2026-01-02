import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  // Read body once at the start
  let body: any;
  try {
    body = await req.json();
  } catch (parseError) {
    return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
  }

  const { userAnswer, standardAnswer, context } = body;

  if (!userAnswer || !standardAnswer) {
    return NextResponse.json(
      { error: "Missing required fields: userAnswer and standardAnswer" },
      { status: 400 }
    );
  }

  // Read Config
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL || "https://api.deepseek.com";
  const model = process.env.OPENAI_MODEL || "deepseek-chat";

  // Mock Fallback if no key is set
  if (!apiKey || apiKey.startsWith("sk-placeholder")) {
    console.log("Using Mock Mode (No API Key found)");
    return NextResponse.json({
      score: 85,
      feedback: "【模拟数据】API Key 未配置。请在 .env.local 中填入正确的 Key 以启用 DeepSeek AI。",
      diff: [],
    });
  }

  try {
    // Initialize OpenAI Client (DeepSeek Compatible)
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL, // Critical for DeepSeek
    });

    // Call Real AI
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a strict IELTS Writing Tutor. 
          Compare the User's Answer with the Standard Answer.
          
          CRITICAL SCORING RULE:
          - You MUST output a score between 0 and 100 (percentage scale).
          - DO NOT use IELTS Band Scores (0-9). Use percentage scores (0-100) only.
          - 0-59: Poor / Fail (Below Band 6.0)
          - 60-79: Average (Band 6.0-6.5 equivalent)
          - 80-89: Good (Band 7.0-8.0 equivalent)
          - 90-100: Perfect (Band 8.5-9.0 equivalent)
          
          Evaluate based on:
          1. Grammatical accuracy
          2. Vocabulary usage and collocations
          3. Sentence structure and complexity
          4. Meaning accuracy compared to standard answer
          
          Return JSON format: { "score": number (0-100), "feedback": "string", "diff": [] }
          
          Example: If the answer is excellent but has minor issues, give 85-90. If it's perfect, give 95-100.`,
        },
        {
          role: "user",
          content: `Standard: "${standardAnswer}"\nUser: "${userAnswer}"${context ? `\nContext: ${context}` : ""}`,
        },
      ],
      model: model,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content || "{}");

    // Validate response structure
    if (result.score === undefined || result.score === null) {
      throw new Error("Invalid response structure: missing score");
    }

    // Normalize score to 0-100 range
    let normalizedScore = Number(result.score);
    
    // If AI returned IELTS Band Score (0-9), convert to percentage (0-100)
    // This is a safety net in case AI ignores the prompt and returns Band Score
    if (normalizedScore >= 0 && normalizedScore <= 9 && normalizedScore < 10) {
      console.warn(`AI returned Band Score ${normalizedScore}, converting to percentage scale`);
      // Convert Band Score to percentage: Band 9 = 95-100, Band 8 = 85-90, etc.
      const bandToPercentage: Record<number, number> = {
        9: 95,
        8.5: 90,
        8: 85,
        7.5: 80,
        7: 75,
        6.5: 70,
        6: 65,
        5.5: 55,
        5: 50,
        4.5: 45,
        4: 40,
        3.5: 35,
        3: 30,
        2.5: 25,
        2: 20,
        1.5: 15,
        1: 10,
        0: 5,
      };
      // Check for exact match first, then try rounding to nearest 0.5
      if (bandToPercentage[normalizedScore] !== undefined) {
        normalizedScore = bandToPercentage[normalizedScore];
      } else {
        // Round to nearest 0.5 and convert
        const rounded = Math.round(normalizedScore * 2) / 2;
        normalizedScore = bandToPercentage[rounded] || normalizedScore * 11.11; // Fallback conversion
      }
    }
    
    // Ensure score is within 0-100 range
    normalizedScore = Math.max(0, Math.min(100, Math.round(normalizedScore)));

    return NextResponse.json({
      score: normalizedScore,
      feedback: result.feedback || "No feedback available.",
      diff: result.diff || [],
    });
  } catch (error: any) {
    console.error("DeepSeek API Error:", error);

    // Fallback: Return a mock response if API fails
    if (userAnswer && standardAnswer) {
      // Enhanced similarity calculation as fallback
      const userLower = userAnswer.toLowerCase().trim();
      const standardLower = standardAnswer.toLowerCase().trim();
      const userWords = userLower.split(/\s+/);
      const standardWords = standardLower.split(/\s+/);
      const commonWords = userWords.filter((word: string) => standardWords.includes(word));
      const score = Math.round((commonWords.length / Math.max(userWords.length, standardWords.length)) * 100);

      // Generate feedback based on score
      let feedback = "";
      if (score >= 90) {
        feedback = "优秀！你的翻译与标准答案非常接近。注意检查语法细节和词汇搭配。";
      } else if (score >= 70) {
        feedback = "良好！你的翻译抓住了大部分关键要素。建议使用更正式的词汇和检查固定搭配。";
      } else if (score >= 50) {
        feedback = "需要改进。你的翻译思路正确，但需要关注标准答案中的关键词汇和语法结构。";
      } else {
        feedback = "需要大量练习。请仔细对比标准答案，注意语法结构和关键词汇的使用。";
      }

      return NextResponse.json({
        score,
        feedback: `[本地模式] DeepSeek API 暂时不可用。${feedback} 相似度：${score}%`,
        diff: [],
      });
    }

    return NextResponse.json(
      {
        error: "Failed to process with DeepSeek",
        message: error?.message || "Unknown error",
        details: "Please check your network connection and API key configuration.",
      },
      { status: 500 }
    );
  }
}
