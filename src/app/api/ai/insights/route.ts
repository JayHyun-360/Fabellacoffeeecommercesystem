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

function buildFallbackInsight(body: InsightPayload) {
  const activeOrders = (body.orders ?? []).filter(
    (order) => order.status !== "cancelled",
  );
  const revenue = activeOrders.reduce(
    (sum, order) => sum + (order.total ?? 0),
    0,
  );

  const itemCounts: Record<string, number> = {};
  activeOrders.forEach((order) => {
    (order.items ?? []).forEach((item) => {
      itemCounts[item.name] =
        (itemCounts[item.name] ?? 0) + (item.quantity ?? 1);
    });
  });

  const topProducts = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  const unavailableProducts = (body.products ?? [])
    .filter((product) => product.available === false)
    .map((product) => product.name)
    .slice(0, 2);

  const recommendations = [
    topProducts[0]
      ? `Promote ${topProducts[0]} more prominently today.`
      : "Review your top-selling items and increase visibility.",
    unavailableProducts.length > 0
      ? `Check availability for ${unavailableProducts.join(", ")}.`
      : "Review pricing and bundles for slower-moving items.",
    "Prepare the most popular items earlier during busy periods.",
  ];

  const risks = [
    activeOrders.length < 5
      ? "Sales activity is still limited, so trends may be early."
      : "A small set of products may be driving most revenue.",
    "Low stock or unavailable items can reduce conversion if not fixed quickly.",
  ];

  return {
    summary: `You currently have ${activeOrders.length} active orders with ₱${revenue.toLocaleString()} in revenue. ${topProducts[0] ? `Popular items include ${topProducts.slice(0, 2).join(" and ")}.` : "Sales data is still limited."}`,
    topProducts,
    recommendations,
    risks,
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const body: InsightPayload = await request.json();

  try {
    if (!apiKey) {
      return NextResponse.json({ insight: buildFallbackInsight(body) });
    }

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
      const message = data?.error?.message || "Gemini API request failed.";
      console.warn("Gemini insights fallback triggered:", message);
      return NextResponse.json({ insight: buildFallbackInsight(body) });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return NextResponse.json({ insight: buildFallbackInsight(body) });
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
    return NextResponse.json({
      insight: buildFallbackInsight(body),
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate AI insights.",
    });
  }
}
