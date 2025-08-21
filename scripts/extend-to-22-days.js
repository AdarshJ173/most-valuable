/**
 * Extend current raffle to 22 days from now (as per PRD specification)
 * Run this with: node scripts/extend-to-22-days.js
 */

const { ConvexHttpClient } = require("convex/browser");
const { api } = require("../convex/_generated/api");

require('dotenv').config({ path: '.env.local' });

async function extendRaffleTo22Days() {
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
    console.log('📅 Extending raffle to 22 days (PRD specification)...');
    
    // Calculate new end date - 22 days from now
    const now = new Date();
    const newEndDate = new Date(now.getTime() + (22 * 24 * 60 * 60 * 1000));
    
    console.log('⏰ New Timeline:');
    console.log('   Current Time:', now.toLocaleString());
    console.log('   New End Date:', newEndDate.toLocaleString());
    console.log('   Duration: 22 days (PRD requirement)');
    
    console.log('\n🚀 Updating raffle configuration...');
    
    const result = await convex.action(api.entriesNode.extendRaffle, {
      adminToken: process.env.ADMIN_TOKEN,
      newEndDate: newEndDate.getTime()
    });
    
    console.log('✅ Raffle extended successfully!');
    console.log('📊 New End Date:', new Date(result.newEndDate).toLocaleString());
    
    // Verify the change
    console.log('\n🔍 Verifying updated configuration...');
    const publicConfig = await convex.query(api.payments.getRaffleConfig);
    
    if (publicConfig) {
      const timeRemaining = publicConfig.endDate - Date.now();
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      console.log('✅ Verification successful!');
      console.log('📊 Updated Raffle:');
      console.log('   Name:', publicConfig.name);
      console.log('   End Date:', new Date(publicConfig.endDate).toLocaleString());
      console.log(`   Time Remaining: ${days} days, ${hours} hours`);
      console.log('   Status:', publicConfig.isActive ? '🟢 ACTIVE' : '🔴 INACTIVE');
    }
    
    console.log('\n🎉 22-day raffle timer is now active!');
    console.log('🌐 Visit your shop page to see the countdown timer.');
    console.log('📝 The raffle will run for exactly 22 days as per PRD specification.');
    
  } catch (error) {
    console.error('❌ Error extending raffle:', error.message);
    
    if (error.message.includes('No active raffle')) {
      console.log('💡 Tip: Initialize raffle first with: node scripts/init-raffle-timer.js');
    }
    
    process.exit(1);
  }
}

extendRaffleTo22Days();
