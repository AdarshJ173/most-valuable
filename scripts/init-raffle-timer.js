/**
 * Initialize raffle configuration with proper timer dates
 * Run this with: node scripts/init-raffle-timer.js
 */

const { ConvexHttpClient } = require("convex/browser");
const { api } = require("../convex/_generated/api");

require('dotenv').config({ path: '.env.local' });

async function initRaffleTimer() {
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
    console.log('🎯 Initializing raffle timer configuration...');
    
    // Calculate dates for demo/testing
    const now = new Date();
    const startDate = new Date(now); // Start immediately
    const endDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from now
    
    console.log('📅 Raffle Timeline:');
    console.log('   Start:', startDate.toLocaleString());
    console.log('   End:', endDate.toLocaleString());
    console.log('   Duration: 7 days');
    
    const raffleConfig = {
      adminToken: process.env.ADMIN_TOKEN,
      name: "Most Valuable Holiday Collection 2025",
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
      pricePerEntry: 2500, // $25.00 in cents
      bundlePrice: 10000, // $100.00 in cents (5 entries for $100)
      bundleSize: 5,
      productName: "Most Valuable Holiday Collection",
      productDescription: "Exclusive limited-edition holiday merchandise collection featuring premium quality items."
    };

    console.log('⚙️ Configuration:');
    console.log('   Name:', raffleConfig.name);
    console.log('   Product:', raffleConfig.productName);
    console.log('   Entry Price: $' + (raffleConfig.pricePerEntry / 100));
    console.log('   Bundle: ' + raffleConfig.bundleSize + ' entries for $' + (raffleConfig.bundlePrice / 100));
    console.log('   Savings: $' + ((raffleConfig.bundleSize * raffleConfig.pricePerEntry - raffleConfig.bundlePrice) / 100));
    
    console.log('\n🚀 Creating raffle configuration...');
    const result = await convex.action(api.entriesNode.setupRaffle, raffleConfig);
    
    console.log('✅ Raffle timer initialization successful!');
    console.log('📊 Database ID:', result);
    console.log('\n🎉 Your raffle countdown timer is now active!');
    console.log('🌐 Visit your shop page to see the timer in action.');
    
    console.log('\n📝 Next Steps:');
    console.log('   1. Visit /shop to see the countdown timer');
    console.log('   2. Test purchasing raffle entries');
    console.log('   3. Monitor entries in /admin dashboard');
    console.log('   4. Update dates later if needed via admin API');
    
  } catch (error) {
    console.error('❌ Error initializing raffle timer:', error.message);
    
    if (error.message.includes('already')) {
      console.log('\n💡 Tip: A raffle may already exist. Use admin API to update dates if needed.');
    }
    
    process.exit(1);
  }
}

initRaffleTimer();
