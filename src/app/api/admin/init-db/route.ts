import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

export async function POST() {
  try {
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      return NextResponse.json(
        { error: "Convex URL not configured" },
        { status: 500 }
      );
    }

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    
    // Check if raffle config already exists
    const raffleConfig = await convex.query(api.payments.getRaffleConfig);
    
    if (raffleConfig) {
      return NextResponse.json({
        success: true,
        message: "Database is already initialized with raffle configuration",
        config: raffleConfig,
      });
    }

    // For now, return a message that manual setup is needed
    // The actual initialization should be done via Convex dashboard or CLI
    return NextResponse.json({
      success: false,
      message: "No raffle configuration found. Please initialize using Convex dashboard or contact admin.",
      instructions: [
        "1. Access Convex dashboard",
        "2. Use raffleMutations.createRaffleConfig to create initial config",
        "3. Set appropriate start/end dates and pricing"
      ]
    });
  } catch (error) {
    console.error("Error checking database:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Failed to check database"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      return NextResponse.json(
        { error: "Convex URL not configured" },
        { status: 500 }
      );
    }

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    
    // Get current database status
    const raffleConfig = await convex.query(api.payments.getRaffleConfig);
    const entries = await convex.query(api.entries.getAllEntries, { limit: 1000 });
    const completedEntries = entries?.entries?.filter(e => e.paymentStatus === "completed") || [];
    
    return NextResponse.json({
      hasRaffleConfig: !!raffleConfig,
      raffleConfig,
      stats: {
        totalEntries: entries?.entries?.length || 0,
        completedEntries: completedEntries.length,
        totalRevenue: completedEntries.reduce((sum, entry) => sum + entry.amount, 0),
        uniqueParticipants: new Set(completedEntries.map(e => e.email)).size,
      },
      isInitialized: !!raffleConfig,
    });
  } catch (error) {
    console.error("Error getting database status:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to get database status"
      },
      { status: 500 }
    );
  }
}
