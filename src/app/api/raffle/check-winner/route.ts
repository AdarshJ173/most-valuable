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
    
    // Check if there's already a winner
    const existingWinner = await convex.query(api.winnerSelection.getCurrentWinner);
    
    if (existingWinner) {
      return NextResponse.json({
        success: true,
        message: "Winner already selected",
        winner: {
          email: existingWinner.winnerEmail,
          selectedAt: existingWinner.selectedAt,
          totalLeadsCount: existingWinner.totalEntriesInPool,
        },
        alreadySelected: true
      });
    }

    // Check raffle status to see if it has ended and can select winner
    const raffleConfig = await convex.query(api.payments.getRaffleConfig);
    if (!raffleConfig) {
      return NextResponse.json({
        success: false,
        error: "No active raffle found",
        winner: null,
        alreadySelected: false
      });
    }

    const now = Date.now();
    if (now < raffleConfig.endDate) {
      return NextResponse.json({
        success: false,
        error: "Raffle has not ended yet",
        winner: null,
        alreadySelected: false
      });
    }

    // Get all entries to check if there are participants
    const entries = await convex.query(api.entries.getAllEntries, { limit: 1 });
    const completedEntries = entries?.entries?.filter(e => e.paymentStatus === "completed") || [];
    
    if (completedEntries.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No participants in raffle",
        winner: null,
        alreadySelected: false
      });
    }

    // Raffle has ended and has participants but no winner yet
    // This is a situation where manual winner selection is needed
    // Return appropriate response indicating admin action needed
    return NextResponse.json({
      success: false,
      message: "Raffle has ended with participants. Admin winner selection required.",
      error: "Winner selection must be performed by admin",
      winner: null,
      alreadySelected: false
    });
    
  } catch (error) {
    console.error("Error checking for winner:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to check for winner",
        winner: null,
        alreadySelected: false
      },
      { status: 500 }
    );
  }
}
