import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      return NextResponse.json(
        { error: "Convex URL not configured" },
        { status: 500 }
      );
    }

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    
    // Get raffle configuration
    const raffleConfig = await convex.query(api.payments.getRaffleConfig);
    
    if (!raffleConfig) {
      return NextResponse.json({
        error: "No active raffle found"
      }, { status: 404 });
    }

    // Check if there's a winner
    const currentWinner = await convex.query(api.winnerSelection.getCurrentWinner);
    
    // Get entry count to determine participant numbers
    const entries = await convex.query(api.entries.getAllEntries, { limit: 1000 });
    const completedEntries = entries?.entries?.filter(e => e.paymentStatus === "completed") || [];
    const uniqueParticipants = new Set(completedEntries.map(e => e.email)).size;

    // Calculate status
    const now = Date.now();
    const startDate = raffleConfig.startDate || now;
    const endDate = raffleConfig.endDate || (now + 86400000); // Default to 1 day from now
    const hasEnded = now > endDate;
    const hasWinner = !!currentWinner;
    const timeRemaining = Math.max(0, endDate - now);

    return NextResponse.json({
      startDate,
      endDate,
      currentTime: now,
      hasEnded,
      hasWinner,
      winnerEmail: currentWinner?.winnerEmail || null,
      winnerSelectedAt: currentWinner?.selectedAt || null,
      totalUniqueLeads: uniqueParticipants,
      timeRemaining,
    });
  } catch (error) {
    console.error("Error fetching raffle status:", error);
    return NextResponse.json(
      { error: "Failed to fetch raffle status" },
      { status: 500 }
    );
  }
}
