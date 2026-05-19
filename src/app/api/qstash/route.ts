import { NextResponse } from "next/server";
import { Qstash } from "../../../lib/qstash";
import { telemetryReady } from "../../../middleware/telemetry";

// Minimal QStash endpoint scaffold. Verifies presence of QStash SDK and returns 200.
export async function POST(request: Request) {
  // If QStash not enabled, return 200 JSON to indicate noop (204 must not include a body)
  if (!Qstash) return NextResponse.json({ ok: true, note: "qstash not enabled" }, { status: 200 });

  // Optional: verify signature using Qstash SDK (left as minimal scaffolding)
  // Signature verification is optional; attempt it but proceed if not available
  try {
    // eslint-disable-next-line no-eval
    const req: any = eval("require");
    const { verifyRequestSignature } = req("@upstash/qstash/nextjs");
    const signatureValid = await verifyRequestSignature(request);
    if (!signatureValid) return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  } catch (err) {
    // Verification not configured or SDK missing: continue as scaffold
  }

  // Delegate to a worker handler (business logic belongs elsewhere)
  // For now, respond with ok to show the scaffold is in place.
  return NextResponse.json({ ok: true, telemetry: telemetryReady });
}
