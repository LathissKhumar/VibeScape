import { NextResponse } from "next/server";

export async function GET() {
  const checks: Record<string, string> = {};

  try {
    const { supabase } = await import("@/lib/supabase");
    const { error } = await supabase.from("spotify_cache").select("id").limit(1);
    checks.database = error ? "error" : "ok";
  } catch {
    checks.database = "error";
  }

  try {
    const { default: coreCache } = await import("@/lib/cache/index");
    await coreCache.get("health:ping");
    checks.cache = "ok";
  } catch {
    checks.cache = "error";
  }

  const dbOk = checks.database === "ok";
  const cacheOk = checks.cache === "ok";

  let status: string;
  let httpStatus: number;

  if (dbOk && cacheOk) {
    status = "healthy";
    httpStatus = 200;
  } else if (dbOk) {
    status = "degraded";
    httpStatus = 200;
  } else {
    status = "unhealthy";
    httpStatus = 503;
  }

  return NextResponse.json(
    {
      status,
      uptime: process.uptime(),
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: httpStatus },
  );
}
