import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a simple raffle configuration
 */
export const createSimpleRaffle = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if there's already an active raffle
    const existing = await ctx.db
      .query("raffleConfig")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .first();
    
    if (existing) {
      return existing._id;
    }

    const now = Date.now();
    const startDate = now - (24 * 60 * 60 * 1000); // Started 1 day ago
    const endDate = now + (30 * 24 * 60 * 60 * 1000); // Ends in 30 days
    
    return await ctx.db.insert("raffleConfig", {
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
  },
});

/**
 * Get active raffle
 */
export const getActiveRaffle = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("raffleConfig")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .first();
  },
});
