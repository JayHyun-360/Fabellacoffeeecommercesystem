import { NextResponse } from "next/server";

interface InsightPayload {
  orders: Array<{
    status?: string;
    total?: number;
    items?: Array<{
      name: string;
      quantity?: number;
      price?: number;
    }>;
  }>;
  products: Array<{
    name?: string;
    category?: string;
    available?: boolean;
    price?: number;
    is_featured?: boolean;
    is_promo?: boolean;
  }>;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY in environment variables." },
      { status: 500 },
    );
  }

  try {
    const body: InsightPayload = await request.json();
    const prompt = `You are an AI assistant for a coffee shop admin dashboard. Analyze the following data and return ONLY valid JSON with these keys: summary, topProducts, recommendations, risks.

Sales data:
${JSON.stringify(body.orders.slice(0, 30), null, 2)}

Menu data:
${JSON.stringify(body.products, null, 2)}

Rules:
- summary must be 1 short paragraph.
- topProducts must be an array of 3 short product names.
- recommendations must be an array of 3 practical admin actions.
- risks must be an array of 2 short concerns.
- Keep it concise and practical for a coffee shop owner.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: { temperature: 0.2 },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Gemini API request failed.");
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      throw new Error("No insight response returned from Gemini.");
    }

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let insight;
    try {
      insight = JSON.parse(cleanedText);
    } catch {
      insight = {
        summary: cleanedText,
        topProducts: [],
        recommendations: ["Review recent sales trends and adjust promotions."],
        risks: ["Not enough data for a stronger recommendation."],
      };
    }

    return NextResponse.json({ insight });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate AI insights.",
      },
      { status: 500 },
    );
  }
}
