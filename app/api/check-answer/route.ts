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
          Return JSON format: { score: number, feedback: string, diff: any[] }`,
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
    if (!result.score && result.score !== 0) {
      throw new Error("Invalid response structure");
    }

    return NextResponse.json({
      score: result.score || 0,
      feedback: result.feedback || "No feedback available.",
      diff: result.diff || [],
    });
  } catch (error: any) {
    console.error("DeepSeek API Error:", error);
    
    // Provide detailed error information
    const errorMessage = error?.message || "Unknown error";
    const errorStatus = error?.status || error?.response?.status;
    const errorCode = error?.code;
    
    console.error("Error details:", {
      message: errorMessage,
      status: errorStatus,
      code: errorCode,
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : "Missing",
      baseURL: baseURL,
      model: model,
    });

    // Fallback: Return a mock response if API fails
    if (userAnswer && standardAnswer) {
      // Enhanced similarity calculation as fallback
      const userLower = userAnswer.toLowerCase().trim();
      const standardLower = standardAnswer.toLowerCase().trim();
      const userWords = userLower.split(/\s+/);
      const standardWords = standardLower.split(/\s+/);
      const commonWords = userWords.filter((word) => standardWords.includes(word));
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

      // Provide more specific error information
      let errorInfo = "";
      if (errorStatus === 401) {
        errorInfo = "API Key 无效或已过期";
      } else if (errorStatus === 429) {
        errorInfo = "请求频率过高，请稍后再试";
      } else if (errorCode === "ENOTFOUND" || errorCode === "ECONNREFUSED") {
        errorInfo = "网络连接失败，请检查网络设置";
      } else {
        errorInfo = `错误：${errorMessage}`;
      }

      return NextResponse.json({
        score,
        feedback: `[本地模式] DeepSeek API 暂时不可用（${errorInfo}）。${feedback} 相似度：${score}%`,
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
