import { NextResponse } from "next/server";
import type { JobType } from "../../../lib/qstash";
import handlePersonalityJob from "../../../workers/personality/handler";
import handleEmbeddingJob from "../../../workers/embedding/handler";
import handleAnalyticsJob from "../../../workers/analytics/handler";

function verifyWorkerSecret(request: Request): boolean {
  const secret = request.headers.get("x-worker-secret");
  return secret === process.env.SUPABASE_WORKER_SECRET;
}

export async function POST(request: Request) {
  if (!verifyWorkerSecret(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !body.type) {
    return NextResponse.json({ ok: false, error: "missing type" }, { status: 400 });
  }

  const jobType = body.type as JobType;
  const payload = body.payload as Record<string, unknown> | undefined;

  try {
    switch (jobType) {
      case "personality":
        await handlePersonalityJob(payload ?? {});
        return NextResponse.json({ ok: true, jobType }, { status: 200 });

      case "analytics":
        await handleAnalyticsJob(payload ?? {});
        return NextResponse.json({ ok: true, jobType }, { status: 200 });

      case "embeddings":
        await handleEmbeddingJob(payload ?? {});
        return NextResponse.json({ ok: true, jobType }, { status: 200 });

      default:
        return NextResponse.json({ ok: false, error: `unknown type: ${jobType}` }, { status: 400 });
    }
  } catch (err) {
    console.warn(`worker ${jobType} failed`, err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
