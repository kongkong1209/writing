import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { currentEnglish, topic } = await req.json();

    if (!currentEnglish) {
      return NextResponse.json({ error: "Missing required field: currentEnglish" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "No API Key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      Analyze this sentence structure: "${currentEnglish}"
      Generate a NEW translation exercise using the SAME grammatical structure but for the topic: "${topic}".
      
      Output JSON:
      {
        "chinese": "New Chinese sentence",
        "standardEnglish": "New English translation",
        "explanation": "Brief tip about the structure"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("Gemini Gen Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
