import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { userAnswer, standardAnswer } = await req.json();

    // 1. Read Config
    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL;
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

    // 2. Initialize OpenAI Client (DeepSeek Compatible)
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL, // Critical for DeepSeek
    });

    // 3. Call Real AI
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
          content: `Standard: "${standardAnswer}"\nUser: "${userAnswer}"`,
        },
      ],
      model: model,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content || "{}");

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to fetch AI response" }, { status: 500 });
  }
}
