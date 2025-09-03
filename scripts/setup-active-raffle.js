const { ConvexHttpClient } = require("convex/browser");
const { api } = require("../convex/_generated/api");

async function setupActiveRaffle() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) {
    console.error("CONVEX_URL not configured");
    process.exit(1);
  }

  const convex = new ConvexHttpClient(convexUrl);

  try {
    // Check if there's already an active raffle
    const activeRaffles = await convex.query(api.raffleConfig?.getActiveRaffle || "raffleConfig:getActiveRaffle");
    
    if (activeRaffles?.length > 0) {
      console.log("✅ Active raffle already exists");
      return;
    }

    // Create a new raffle configuration
    const now = Date.now();
    const startDate = now - (24 * 60 * 60 * 1000); // Started 1 day ago
    const endDate = now + (30 * 24 * 60 * 60 * 1000); // Ends in 30 days
    
    const raffleId = await convex.mutation(api.raffleConfig?.createRaffle || "raffleConfig:createRaffle", {
      name: "Gold Rush Collection",
      startDate,
      endDate,
      isActive: true,
      totalEntries: 0,
      pricePerEntry: 5000, // $50.00 in cents
      bundlePrice: 10000, // $100.00 in cents
      bundleSize: 4,
      productName: "Gold Rush Collection",
      productDescription: "Exclusive Most Valuable Gold Rush collection items"
    });

    console.log("✅ Created active raffle:", raffleId);
  } catch (error) {
    console.error("Failed to setup raffle:", error);
    // Proceed anyway - the error might be expected
  }
}

setupActiveRaffle();
