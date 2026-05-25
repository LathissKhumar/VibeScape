import { NextResponse } from "next/server";
import { persistUserProfile, findSimilarUsers } from "@/lib/profilePersistence";
import rateLimit from "@/lib/rateLimiter";

export async function POST(request: Request) {
  const rateKey = `profile:${request.headers.get("x-forwarded-for") || "anonymous"}`;
  const rl = await rateLimit(rateKey, 10, 60);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { action, profile } = body;

    if (action === "persist" && profile) {
      const result = await persistUserProfile(profile);
      const status = result.ok ? 200 : 500;
      return NextResponse.json(result, { status });
    }

    if (action === "find_similar") {
      const { userId, limit } = body;
      const results = await findSimilarUsers(userId || "anonymous", limit || 5);
      return NextResponse.json({ ok: true, results });
    }

    return NextResponse.json({ ok: false, error: "invalid_action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
