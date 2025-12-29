import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Mock response generator for fallback
function generateMockResponse(userAnswer: string, standardAnswer: string) {
  const userLower = userAnswer.toLowerCase().trim();
  const standardLower = standardAnswer.toLowerCase().trim();

  // Simple word matching
  const userWords = userLower.split(/\s+/);
  const standardWords = standardLower.split(/\s+/);
  const commonWords = userWords.filter((word) => standardWords.includes(word));
  const score = Math.round((commonWords.length / Math.max(userWords.length, standardWords.length)) * 100);

  // Generate diff
  const diff = standardWords.map((word) => {
    const isInUser = userWords.includes(word);
    return {
      word,
      status: isInUser ? ("correct" as const) : ("missing" as const),
    };
  });

  // Generate feedback based on score
  let feedback = "";
  if (score >= 90) {
    feedback = "Excellent! Your translation is very close to the model answer. Well done!";
  } else if (score >= 70) {
    feedback = "Good job! Your translation captures most of the key elements. Consider using more formal vocabulary and checking collocations.";
  } else if (score >= 50) {
    feedback = "Your translation has the right idea, but needs improvement. Focus on using the key collocations from the model answer and maintaining formal tone.";
  } else {
    feedback = "Your translation needs significant improvement. Review the model answer and pay attention to grammar structure and key vocabulary.";
  }

  return {
    score,
    feedback,
    diff,
  };
}

export async function POST(request: NextRequest) {
  // Read body once at the start
  let body: any;
  try {
    body = await request.json();
  } catch (parseError) {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { userAnswer, standardAnswer, context } = body;

  try {

    if (!userAnswer || !standardAnswer) {
      return NextResponse.json(
        { error: "Missing required fields: userAnswer and standardAnswer" },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Return mock response if no API key
      console.log("OpenAI API key not found, using mock response");
      const mockResponse = generateMockResponse(userAnswer, standardAnswer);
      return NextResponse.json(mockResponse);
    }

    // Use OpenAI API
    const openai = new OpenAI({ apiKey });

    const prompt = `You are a strict IELTS Writing Tutor. Compare the student's sentence with the Model Answer.

Model Answer: "${standardAnswer}"
Student's Answer: "${userAnswer}"
${context ? `Context/Topic: ${context}` : ""}

Please analyze the student's answer and provide:
1. **Collocation Check**: Did they use the key phrases from the model answer?
2. **Grammar & Tone**: Is it formal enough for IELTS Writing?
3. **Accuracy**: How close is it to the model answer?

Output your response as a JSON object with this exact structure:
{
  "score": <number between 0-100>,
  "feedback": "<detailed feedback string in English, explaining what's good and what needs improvement>",
  "diff": [
    {
      "word": "<word from model answer>",
      "status": "correct" | "wrong" | "missing"
    }
  ]
}

The "diff" array should contain all significant words/phrases from the model answer, marking them as:
- "correct": if the student used a similar/equivalent word
- "wrong": if the student used a different word that changes meaning
- "missing": if the student didn't include this word/phrase

Be strict but fair. Focus on IELTS Writing standards.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert IELTS Writing tutor. Always respond with valid JSON only, no additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    // Parse JSON response
    let aiResponse;
    try {
      aiResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback to mock response
      return NextResponse.json(generateMockResponse(userAnswer, standardAnswer));
    }

    // Validate response structure
    if (!aiResponse.score || !aiResponse.feedback) {
      console.error("Invalid AI response structure:", aiResponse);
      return NextResponse.json(generateMockResponse(userAnswer, standardAnswer));
    }

    return NextResponse.json({
      score: aiResponse.score,
      feedback: aiResponse.feedback,
      diff: aiResponse.diff || [],
    });
  } catch (error: any) {
    console.error("Error in check-answer API:", error);

    // Use already parsed body for fallback
    if (body?.userAnswer && body?.standardAnswer) {
      return NextResponse.json(generateMockResponse(body.userAnswer, body.standardAnswer));
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

