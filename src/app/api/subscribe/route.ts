import { NextResponse } from "next/server";

type Body = { email?: string; phone?: string };

export async function POST(request: Request) {
  try {
    // Add timeout for request parsing
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request parsing timeout')), 10000)
    );
    
    const bodyPromise = request.json();
    const { email, phone } = (await Promise.race([bodyPromise, timeoutPromise])) as Body;
    
    // Enhanced validation with better error messages
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ ok: false, error: "Invalid email format" }, { status: 400 });
    }
    
    if (phone && (typeof phone !== "string" || !phone.trim())) {
      return NextResponse.json({ ok: false, error: "Invalid phone number" }, { status: 400 });
    }
    
    // Optional phone normalization/validation (E.164) - let Convex do final validation too
    if (phone && phone.trim()) {
      const e164 = /^\+[1-9]\d{6,14}$/;
      if (!e164.test(phone.trim())) {
        return NextResponse.json(
          { ok: false, error: "Invalid phone number. Use international format like +14155552671." },
          { status: 400 }
        );
      }
    }

    // Integrate with Convex lead collection
    const { ConvexHttpClient } = await import("convex/browser");
    const { api } = await import("../../../../convex/_generated/api");

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json({ ok: false, error: "Convex URL not configured" }, { status: 500 });
    }

    const convex = new ConvexHttpClient(convexUrl);

    const ipAddress =
      (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "") as string;

    await convex.mutation(api.leads.addLead, {
      email: email.toLowerCase(),
      phone: phone || undefined,
      source: "landing",
      ipAddress,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bad request";
    // Send through specific errors (e.g., phone validation) while keeping 400 status
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

