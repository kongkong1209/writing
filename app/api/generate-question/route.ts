import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Mock response generator for fallback
function generateMockQuestion(currentChinese: string, currentEnglish: string, topic: string) {
  // Simple template-based generation
  const templates = [
    {
      chinese: `关于${topic}，我们需要采取积极的措施来应对挑战。`,
      standardEnglish: `Regarding ${topic}, we need to take proactive measures to address the challenges.`,
      explanation: `This sentence uses the structure "Regarding [topic], we need to..." which is common in IELTS Writing Task 2.`,
    },
    {
      chinese: `${topic}不仅影响个人，也影响整个社会。`,
      standardEnglish: `${topic} affects not only individuals but also society as a whole.`,
      explanation: `This uses the "not only... but also..." structure, which is highly valued in IELTS Writing.`,
    },
    {
      chinese: `为了解决${topic}问题，政府应该制定有效的政策。`,
      standardEnglish: `To address the issue of ${topic}, the government should implement effective policies.`,
      explanation: `This sentence uses "To address the issue of..." which is a formal way to introduce solutions.`,
    },
  ];

  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  return {
    chinese: randomTemplate.chinese,
    standardEnglish: randomTemplate.standardEnglish,
    explanation: randomTemplate.explanation,
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

  const { currentChinese, currentEnglish, topic } = body;

  try {

    if (!currentChinese || !currentEnglish) {
      return NextResponse.json(
        { error: "Missing required fields: currentChinese and currentEnglish" },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Return mock response if no API key
      console.log("OpenAI API key not found, using mock question generator");
      const mockQuestion = generateMockQuestion(
        currentChinese,
        currentEnglish,
        topic || "this topic"
      );
      return NextResponse.json(mockQuestion);
    }

    // Use OpenAI API
    const openai = new OpenAI({ apiKey });

    const prompt = `You are an IELTS Writing tutor. Analyze the grammatical structure of the provided English sentence and generate a NEW Chinese-English translation pair.

Current Chinese: "${currentChinese}"
Current English: "${currentEnglish}"
${topic ? `New Topic: ${topic}` : "Generate a new topic related to IELTS Writing Task 2"}

Your task:
1. Identify the key grammatical structure used in the current English sentence (e.g., "not only... but also...", "It is... that...", passive voice, etc.)
2. Generate a NEW Chinese sentence that uses the SAME grammatical structure but discusses a DIFFERENT topic (use the provided topic if given, otherwise choose a common IELTS topic like education, environment, technology, etc.)
3. Provide the English translation that maintains the same structure
4. Explain why this structure is useful for IELTS Writing

Output your response as a JSON object with this exact structure:
{
  "chinese": "<new Chinese sentence>",
  "standardEnglish": "<new English sentence using the same structure>",
  "explanation": "<brief explanation of the grammatical structure and why it's useful for IELTS Writing>"
}

Make sure the new sentence is:
- Formally written (appropriate for IELTS Writing Task 2)
- Uses the same grammatical structure as the original
- Discusses a different topic
- Is realistic and natural`;

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
      temperature: 0.7,
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
      return NextResponse.json(
        generateMockQuestion(currentChinese, currentEnglish, topic || "this topic")
      );
    }

    // Validate response structure
    if (!aiResponse.chinese || !aiResponse.standardEnglish) {
      console.error("Invalid AI response structure:", aiResponse);
      return NextResponse.json(
        generateMockQuestion(currentChinese, currentEnglish, topic || "this topic")
      );
    }

    return NextResponse.json({
      chinese: aiResponse.chinese,
      standardEnglish: aiResponse.standardEnglish,
      explanation: aiResponse.explanation || "Generated using the same grammatical structure.",
    });
  } catch (error: any) {
    console.error("Error in generate-question API:", error);

    // Use already parsed body for fallback
    if (body?.currentChinese && body?.currentEnglish) {
      return NextResponse.json(
        generateMockQuestion(body.currentChinese, body.currentEnglish, body.topic || "this topic")
      );
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

