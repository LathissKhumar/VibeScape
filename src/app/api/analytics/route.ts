import { NextResponse } from "next/server";
import { emitEvent } from "@/lib/events";
import rateLimit from "@/lib/rateLimiter";

export async function POST(request: Request) {
  const rateKey = `analytics:${request.headers.get("x-forwarded-for") || "anonymous"}`;
  const rl = await rateLimit(rateKey, 100, 60);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  try {
    const body = await request.json();
    await emitEvent("generic", {
      type: body.type || "unknown",
      section: body.section,
      element: body.element,
      metadata: body.metadata,
      timestamp: body.timestamp,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
}
