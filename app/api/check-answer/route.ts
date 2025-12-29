import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { userAnswer, standardAnswer } = await req.json();

    if (!userAnswer || !standardAnswer) {
      return NextResponse.json(
        { error: "Missing required fields: userAnswer and standardAnswer" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        score: 0,
        feedback: "Error: GEMINI_API_KEY is missing in .env.local",
        diff: [],
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use 'gemini-1.5-flash' for speed and cost efficiency
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      You are a strict IELTS Writing Tutor.
      Compare the Student's Answer with the Standard Answer.
      
      Standard Answer: "${standardAnswer}"
      Student Answer: "${userAnswer}"
      
      Analyze based on:
      1. Collocation: Did they use the key phrases?
      2. Grammar & Accuracy.
      
      Output ONLY a JSON object with this structure:
      {
        "score": number (0-100),
        "feedback": "string (concise advice)",
        "diff": [] (leave empty for now as frontend handles visual diff)
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonResponse = JSON.parse(text);

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to process with Gemini" }, { status: 500 });
  }
}
