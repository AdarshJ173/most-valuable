import { NextResponse } from "next/server";

// POST /api/checkout
// Body: { quantity: number, email?: string, phone?: string }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const quantity = Number(body?.quantity ?? 0);
    let email = typeof body?.email === "string" ? body.email : undefined;
    const phone = typeof body?.phone === "string" ? body.phone : undefined;

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    // Delegate to Convex action which also creates a pending entry
    const { ConvexHttpClient } = await import("convex/browser");
    const { api } = await import("../../../../convex/_generated/api");

    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      return NextResponse.json({ error: "Convex URL not configured" }, { status: 500 });
    }

    const origin = (typeof req.headers.get === "function" && req.headers.get("origin")) || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const ipAddress =
      (typeof req.headers.get === "function" && (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip"))) ||
      undefined;

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

    const isBundle = quantity === 5; // UI currently offers 1 or 5

    // TEMP workaround: Convex deployment still requires email; synthesize if absent
    if (!email) {
      const ts = Date.now();
      email = `guest+${ts}@example.com`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await convex.action((api as unknown as any).stripeActions.createCheckoutSession, {
      email: email?.toLowerCase(),
      phone,
      count: quantity,
      bundle: isBundle,
      successUrl: `${origin}/thank-you`,
      cancelUrl: `${origin}/shop`,
      ipAddress,
    });

    return NextResponse.json({ url: result.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err ?? "Bad request");
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

