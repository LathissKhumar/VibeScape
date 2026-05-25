import { NextResponse } from "next/server";
import featureFlags from "@/lib/feature-flags";

export async function GET() {
  try {
    const all = await featureFlags.getAll();
    return NextResponse.json({ flags: all });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { key, value } = body;
    if (typeof key !== "string") return NextResponse.json({ ok: false, error: "invalid key" }, { status: 400 });
    const bool = !!value;
    await featureFlags.set(key, bool);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}
