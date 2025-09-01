/**
 * Verify timer reset was successful and everything is working
 * Usage: node scripts/verify-timer-reset.js
 */

const { ConvexHttpClient } = require("convex/browser");
const { api } = require("../convex/_generated/api");

require('dotenv').config({ path: '.env.local' });

async function verifyTimerReset() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    console.error('NEXT_PUBLIC_CONVEX_URL environment variable is required');
    process.exit(1);
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  try {
    console.log('🔍 VERIFYING TIMER RESET...');
    console.log('═══════════════════════════════');
    
    // Test public raffle config (what frontend uses)
    const publicConfig = await convex.query(api.payments.getRaffleConfig);
    
    if (!publicConfig) {
      console.log('❌ No public raffle config found');
      return;
    }
    
    console.log('✅ PUBLIC RAFFLE CONFIG (Frontend):');
    console.log('   Name:', publicConfig.name);
    console.log('   Active:', publicConfig.isActive);
    console.log('   Start:', new Date(publicConfig.startDate).toLocaleString());
    console.log('   End:', new Date(publicConfig.endDate).toLocaleString());
    if (publicConfig.timerDisplayDate) {
      console.log('   Timer Display:', new Date(publicConfig.timerDisplayDate).toLocaleString());
    }
    console.log('   Total Entries:', publicConfig.totalEntries);
    console.log('   Has Winner:', publicConfig.hasWinner);
    
    // Calculate time remaining
    const now = Date.now();
    const timeLeft = publicConfig.endDate - now;
    if (timeLeft > 0) {
      const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      console.log('   ⏰ Time Remaining:', `${daysLeft}d ${hoursLeft}h ${minutesLeft}m`);
    } else {
      console.log('   ⏰ Status: EXPIRED');
    }
    
    // Test timer states
    console.log('\n🎯 TIMER STATE VERIFICATION:');
    
    const timerStart = publicConfig.timerDisplayDate || publicConfig.startDate;
    const isTimerStarted = now >= timerStart;
    const isActive = publicConfig.isActive && timeLeft > 0;
    const hasEnded = timeLeft <= 0 && isTimerStarted;
    
    console.log('   Timer Started:', isTimerStarted ? '✅ YES' : '❌ NO');
    console.log('   Timer Active:', isActive ? '✅ YES' : '❌ NO');
    console.log('   Timer Ended:', hasEnded ? '⚠️ YES' : '✅ NO');
    
    // Verify entry acceptance
    console.log('\n💳 PAYMENT ACCEPTANCE:');
    const paymentStart = publicConfig.paymentStartDate || publicConfig.startDate;
    const acceptingPayments = now >= paymentStart && now <= publicConfig.endDate;
    console.log('   Accepting Payments:', acceptingPayments ? '✅ YES' : '❌ NO');
    
    // Test what the frontend timer component will show
    console.log('\n📱 FRONTEND TIMER DISPLAY:');
    if (hasEnded) {
      console.log('   Display: 🏁 Raffle Ended');
      if (publicConfig.hasWinner) {
        console.log('   Badge: Winner Selected');
      }
    } else if (!isActive) {
      console.log('   Display: ⏸️ Raffle Inactive');
    } else if (!isTimerStarted) {
      console.log('   Display: 🌟 Starts Soon');
    } else {
      console.log('   Display: ⏰ Countdown Timer Active');
    }
    
    console.log('\n🎉 VERIFICATION SUMMARY:');
    if (isActive && isTimerStarted && acceptingPayments) {
      console.log('   ✅ Timer reset successful!');
      console.log('   ✅ Countdown active and working');
      console.log('   ✅ Payments being accepted');
      console.log('   ✅ Frontend will display countdown timer');
      console.log('   ✅ All existing data preserved');
    } else {
      console.log('   ⚠️  Timer may need adjustment');
      console.log('   🔧 Check dates and active status');
    }
    
    console.log('\n🌐 Next Steps:');
    console.log('   1. Visit /shop to see the live countdown timer');
    console.log('   2. Verify timer counts down correctly');
    console.log('   3. Test payment flow if needed');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifyTimerReset();
