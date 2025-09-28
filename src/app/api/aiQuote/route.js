import { NextResponse } from "next/server";
import OpenAI from "openai";

// Create OpenAI client (requires API key in .env.local)
let client = null;
if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// --- fallback ranges by service ---
const FALLBACK_RANGES = {
  "Loft Conversion": [18000, 45000],
  "Extension": [25000, 70000],
  "Bathroom Renovation": [4000, 12000],
  "Kitchen Renovation": [8000, 25000],
  "Roof Repair": [500, 5000],
  "Plumbing": [150, 1500],
  "Electrical Work": [200, 2500],
  "Painting & Decorating": [300, 5000],
  "Flooring": [500, 8000],
  "Driveway / Paving": [2000, 15000],
  "Windows & Doors": [1000, 8000],
  "Conservatory": [8000, 25000],
};

function getFallbackQuote(service, answers) {
  const baseRange = FALLBACK_RANGES[service] || [1000, 10000];
  const [min, max] = baseRange;

  // adjust roughly if user gave budget
  let budget = 0;
  if (answers?.budget) {
    const match = answers.budget.replace(/[^\d]/g, "");
    budget = parseInt(match || "0", 10);
  }

  let adjustedMin = min;
  let adjustedMax = max;

  if (budget > 0) {
    // if budget is way lower, shrink range
    if (budget < min) {
      adjustedMin = Math.round(budget * 0.8);
      adjustedMax = Math.round(budget * 1.2);
    }
    // if budget is within range, bias range around it
    else if (budget >= min && budget <= max) {
      adjustedMin = Math.round(budget * 0.9);
      adjustedMax = Math.round(budget * 1.1);
    }
    // if budget exceeds range, expand upwards
    else if (budget > max) {
      adjustedMin = Math.round(budget * 0.8);
      adjustedMax = Math.round(budget * 1.1);
    }
  }

  return {
    service,
    estimatedRange: [adjustedMin, adjustedMax],
    note: "Fallback estimate used — ranges are approximate and for guidance only.",
  };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { service, answers } = body;

    if (!service) {
      return NextResponse.json({ error: "Service is required" }, { status: 400 });
    }

    // ✅ Try OpenAI if available
    if (client) {
      try {
        const prompt = `
You are a UK building cost estimator. 
Service: ${service}
Details: ${JSON.stringify(answers, null, 2)}

Give a realistic UK cost range in GBP (min and max).
Respond only with JSON like:
{"min":12000,"max":25000,"note":"Loft conversions vary based on size and roof type."}
        `;

        const completion = await client.responses.create({
          model: "gpt-4.1-mini",
          input: prompt,
          temperature: 0.3,
        });

        const raw = completion.output_text?.trim();
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            return NextResponse.json({
              service,
              estimatedRange: [parsed.min, parsed.max],
              note: parsed.note || "AI-generated estimate.",
            });
          } catch {
            // if AI gave garbage, fallback
            return NextResponse.json(getFallbackQuote(service, answers));
          }
        }
      } catch (err) {
        console.error("OpenAI API error:", err.message);
        return NextResponse.json(getFallbackQuote(service, answers));
      }
    }

    // ❌ No API key → fallback
    return NextResponse.json(getFallbackQuote(service, answers));
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
