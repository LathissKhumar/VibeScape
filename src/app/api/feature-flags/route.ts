import { NextResponse } from "next/server";
import featureFlags from "@/lib/feature-flags";

export async function GET() {
  const all = await featureFlags.getAll();
  return NextResponse.json({ flags: all });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { key, value } = body;
    if (typeof key !== "string") return new NextResponse("invalid key", { status: 400 });
    const bool = !!value;
    await featureFlags.set(key, bool);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return new NextResponse("bad request", { status: 400 });
  }
}
