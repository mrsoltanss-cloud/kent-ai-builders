import { NextResponse } from "next/server";
import { z } from "zod";
import { getQuote } from "@/lib/ai/quote";

// Keep this in sync with src/lib/ai/quote.ts
type QuoteParams = {
  service: string;
  rooms?: number;
  areaSqm?: number;
  quality?: "basic" | "standard" | "premium";
  postcode?: string;
  notes?: string;
};

const schema = z.object({
  service: z.string().min(2),
  rooms: z.number().int().positive().optional(),
  areaSqm: z.number().positive().optional(),
  quality: z.enum(["basic","standard","premium"]).optional(),
  postcode: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.format() },
      { status: 400 }
    );
  }

  // Explicitly assert the type to satisfy TS
  const input = parsed.data as QuoteParams;

  const quote = await getQuote(input);
  return NextResponse.json({
    ok: true,
    quote,
    usedAI: !!process.env.OPENAI_API_KEY,
  });
}
