import { NextResponse } from "next/server";

const CACHE_TTL_MS = 5 * 60 * 1000;
const cachedInsights = new Map<string, { value: any; expiresAt: number }>();

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

const MODEL_NAME = "gemini-2.5-flash";
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 2000;

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

function isRetryableGeminiError(responseStatus: number, data: any) {
  const errorStatus = data?.error?.status;
  const errorCode = data?.error?.code;
  const message = data?.error?.message?.toLowerCase() || "";

  return (
    responseStatus === 429 ||
    responseStatus === 503 ||
    errorStatus === "RESOURCE_EXHAUSTED" ||
    errorCode === 429 ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("temporarily unavailable")
  );
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateGeminiInsight(prompt: string, apiKey: string) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
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

    const data = await response.json().catch(() => null);

    if (response.ok) {
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (text) {
        return text;
      }
    }

    const isRetryable = isRetryableGeminiError(response.status, data);
    if (!isRetryable || attempt >= MAX_RETRIES) {
      throw new Error(data?.error?.message || "Gemini API request failed.");
    }

    const delayMs = Math.min(BASE_RETRY_DELAY_MS * 2 ** (attempt - 1), 5000);
    lastError = new Error(data?.error?.message || "Gemini API request failed.");
    console.warn(
      `Gemini request attempt ${attempt} failed. Retrying in ${delayMs}ms...`,
      data?.error?.message || "",
    );
    await sleep(delayMs);
  }

  throw lastError || new Error("Gemini request failed after retries.");
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  const body: InsightPayload = await request.json();
  const cacheKey = JSON.stringify({
    orders: body.orders.slice(0, 20),
    products: body.products.slice(0, 20),
  });

  const cached = cachedInsights.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ insight: cached.value, cached: true });
  }

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

    const text = await generateGeminiInsight(prompt, apiKey);
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

    cachedInsights.set(cacheKey, {
      value: insight,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

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
