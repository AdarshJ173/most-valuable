/**
 * Update raffle dates utility
 * Usage: node scripts/update-raffle-dates.js [days]
 * Example: node scripts/update-raffle-dates.js 14  (extends raffle by 14 days)
 */

const { ConvexHttpClient } = require("convex/browser");
const { api } = require("../convex/_generated/api");

require('dotenv').config({ path: '.env.local' });

async function updateRaffleDates() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    console.error('NEXT_PUBLIC_CONVEX_URL environment variable is required');
    process.exit(1);
  }

  if (!process.env.ADMIN_TOKEN) {
    console.error('ADMIN_TOKEN environment variable is required');
    process.exit(1);
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  // Get days from command line argument, default to 30 days
  const daysFromNow = parseInt(process.argv[2]) || 30;
  
  try {
    console.log(`🎯 Updating raffle to end in ${daysFromNow} days...`);
    
    // Calculate new end date
    const now = new Date();
    const newEndDate = new Date(now.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
    
    console.log('📅 New Timeline:');
    console.log('   Current time:', now.toLocaleString());
    console.log('   New end date:', newEndDate.toLocaleString());
    console.log('   Duration:', daysFromNow + ' days');
    
    // Extend the raffle
    const result = await convex.action(api.entriesNode.extendRaffle, {
      adminToken: process.env.ADMIN_TOKEN,
      newEndDate: newEndDate.getTime()
    });
    
    if (result.success) {
      console.log('✅ Raffle dates updated successfully!');
      console.log('🎉 Countdown timer will now show the new end date.');
      console.log('\n🌐 Visit /shop to see the updated timer.');
    } else {
      console.log('❌ Failed to update raffle dates:', result);
    }
    
  } catch (error) {
    console.error('❌ Error updating raffle dates:', error.message);
    
    if (error.message.includes('already selected')) {
      console.log('\n💡 Note: Cannot extend raffle after winner has been selected.');
    } else if (error.message.includes('No active raffle')) {
      console.log('\n💡 Tip: No active raffle found. Run init-raffle-timer.js first.');
    }
    
    process.exit(1);
  }
}

console.log('⏰ Raffle Date Updater');
console.log('────────────────────────');

updateRaffleDates();
