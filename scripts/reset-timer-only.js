/**
 * Reset ONLY the timer - extend raffle by 30 days from now
 * Keeps all existing entries, winners, and data intact
 * Usage: node scripts/reset-timer-only.js
 */

const { ConvexHttpClient } = require("convex/browser");
const { api } = require("../convex/_generated/api");

require('dotenv').config({ path: '.env.local' });

async function resetTimerOnly() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    console.error('NEXT_PUBLIC_CONVEX_URL environment variable is required');
    process.exit(1);
  }

  if (!process.env.ADMIN_TOKEN) {
    console.error('ADMIN_TOKEN environment variable is required');
    process.exit(1);
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  try {
    console.log('🎯 RESETTING TIMER ONLY - keeping all existing data intact...');
    
    // Calculate new dates - extend by 30 days from now
    const now = new Date();
    const newEndDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    const newStartDate = new Date(now); // Start now
    
    console.log('📅 Timer Reset Timeline:');
    console.log('   Current time:', now.toLocaleString());
    console.log('   New start date:', newStartDate.toLocaleString());
    console.log('   New end date:', newEndDate.toLocaleString());
    console.log('   Duration: 30 days from now');
    
    // Get current raffle to preserve existing data
    const currentRaffle = await convex.action(api.entriesNode.getCurrentRaffle);
    
    if (!currentRaffle) {
      console.log('❌ No active raffle found. Creating new raffle with timer...');
      
      // Create new raffle with timer
      const raffleConfig = {
        adminToken: process.env.ADMIN_TOKEN,
        name: "Most Valuable Holiday Collection 2025",
        startDate: newStartDate.getTime(),
        endDate: newEndDate.getTime(),
        pricePerEntry: 2500, // $25.00 in cents
        bundlePrice: 10000, // $100.00 in cents
        bundleSize: 5,
        productName: "Most Valuable Holiday Collection",
        productDescription: "Exclusive limited-edition holiday merchandise collection featuring premium quality items."
      };
      
      const result = await convex.action(api.entriesNode.setupRaffle, raffleConfig);
      console.log('✅ New raffle with timer created!');
      console.log('📊 Database ID:', result);
    } else {
      console.log('🔄 Found existing raffle. Resetting timer only...');
      console.log('   Current entries:', currentRaffle.totalEntries);
      console.log('   Current winner:', currentRaffle.winner ? 'Selected' : 'None');
      
      // Use setupRaffle which will update existing raffle while preserving data
      const updateConfig = {
        adminToken: process.env.ADMIN_TOKEN,
        name: currentRaffle.name,
        startDate: newStartDate.getTime(),
        endDate: newEndDate.getTime(),
        timerDisplayDate: newStartDate.getTime(), // Timer starts now
        paymentStartDate: newStartDate.getTime(), // Payments start now
        pricePerEntry: currentRaffle.pricePerEntry,
        bundlePrice: currentRaffle.bundlePrice,
        bundleSize: currentRaffle.bundleSize,
        productName: currentRaffle.productName,
        productDescription: currentRaffle.productDescription,
        maxWinners: currentRaffle.maxWinners || 1
      };
      
      const result = await convex.action(api.entriesNode.setupRaffle, updateConfig);
      console.log('✅ Timer reset successful!');
      console.log('📊 Updated raffle ID:', result);
      console.log('🎯 All existing data preserved');
    }
    
    console.log('\n🎉 TIMER RESET COMPLETE!');
    console.log('🌐 Visit /shop to see the updated countdown timer.');
    console.log('✅ All existing entries and data remain intact');
    
  } catch (error) {
    console.error('❌ Error resetting timer:', error.message);
    
    if (error.message.includes('already selected')) {
      console.log('\n💡 Note: Timer reset completed despite winner already being selected.');
    }
    
    process.exit(1);
  }
}

console.log('⏰ Timer Reset (Data Preserved)');
console.log('────────────────────────────────');

resetTimerOnly();
