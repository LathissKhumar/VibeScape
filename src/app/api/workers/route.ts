import { NextResponse } from "next/server";
import { Qstash } from "../../../lib/qstash";

// Minimal worker router — accepts POST jobs and dispatches to handlers.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.job) return NextResponse.json({ ok: false, error: "missing job" }, { status: 400 });

  // If QStash not enabled, accept the job but do not enqueue — this is a scaffold
  if (!Qstash) return NextResponse.json({ ok: true, note: "qstash not enabled; job accepted (noop)" }, { status: 200 });

  // When Qstash is enabled, delegate to QStash enqueue API if available
  try {
    // eslint-disable-next-line no-eval
    const req: any = eval("require");
    const { client } = req("@upstash/qstash/nextjs");
    await client.publish(JSON.stringify(body));
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    // If publish fails, return accepted but note the failure
    // eslint-disable-next-line no-console
    console.warn("qstash publish failed", err);
    return NextResponse.json({ ok: false, error: "enqueue_failed" }, { status: 502 });
  }
}
