/**
 * Direct Email Test Script
 * Sends a test email using the exact same system as the payment confirmation
 * Use this to test if emails are working before any real purchases
 */

const { ConvexHttpClient } = require("convex/browser");
const { api } = require("../convex/_generated/api");

require('dotenv').config({ path: '.env.local' });

async function sendTestEmail(testEmail = null) {
  console.log('📧 Starting Direct Email Test...\n');

  // Check environment variables first
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    console.error('❌ NEXT_PUBLIC_CONVEX_URL not found in environment variables');
    process.exit(1);
  }

  if (!process.env.ADMIN_TOKEN) {
    console.error('❌ ADMIN_TOKEN not found in environment variables');
    process.exit(1);
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  
  try {
    // Get a completed entry to use as test data
    console.log('🔍 Finding test entry data...');
    const completedEntries = await convex.query(api.entries.getCompletedEntries);
    
    if (completedEntries.length === 0) {
      console.log('⚠️  No completed entries found. Creating mock test data...');
      
      // Create a mock entry for testing
      const mockEntryId = 'test_entry_' + Date.now();
      const testEmailAddress = testEmail || 'test@mostvaluableco.com';
      
      console.log(`📧 Testing with mock data:`);
      console.log(`   Email: ${testEmailAddress}`);
      console.log(`   Entry ID: ${mockEntryId}`);
      
      // Test direct email sending via API route
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      
      const emailResponse = await fetch(`${siteUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          entryId: mockEntryId,
          email: testEmailAddress,
          type: 'purchase_confirmation',
        }),
      });

      if (emailResponse.ok) {
        const result = await emailResponse.json();
        console.log('✅ Test email sent successfully!');
        console.log('   Response:', result);
      } else {
        const errorText = await emailResponse.text();
        console.log(`❌ Test email failed with status ${emailResponse.status}:`, errorText);
      }
      
    } else {
      console.log(`✅ Found ${completedEntries.length} completed entries`);
      
      // Use the first completed entry as test data
      const sampleEntry = completedEntries[0];
      const targetEmail = testEmail || sampleEntry.email;
      
      console.log(`📧 Testing with real entry data:`);
      console.log(`   Entry ID: ${sampleEntry._id}`);
      console.log(`   Original Email: ${sampleEntry.email}`);
      console.log(`   Test Email Target: ${targetEmail}`);
      console.log(`   Entry Count: ${sampleEntry.count}`);
      console.log(`   Color: ${sampleEntry.variantColor || 'Not selected'}`);
      console.log(`   Size: ${sampleEntry.size || 'Not selected'}`);
      
      // Test email sending via Convex action (same as payment flow)
      console.log('\n🚀 Sending test email via Convex action...');
      
      try {
        const result = await convex.action(api.emailService.sendPurchaseConfirmationEmail, {
          entryId: sampleEntry._id,
          email: targetEmail, // Use test email instead of original
          count: sampleEntry.count,
        });
        
        console.log('✅ Test email sent successfully via Convex action!');
        console.log('   Result:', result);
        
      } catch (convexError) {
        console.log(`❌ Convex action failed: ${convexError.message}`);
        console.log('\n🔧 Trying direct API route method...');
        
        // Fallback to direct API call
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        
        const emailResponse = await fetch(`${siteUrl}/api/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`,
          },
          body: JSON.stringify({
            entryId: sampleEntry._id,
            email: targetEmail,
            type: 'purchase_confirmation',
          }),
        });

        if (emailResponse.ok) {
          const result = await emailResponse.json();
          console.log('✅ Test email sent successfully via API route!');
          console.log('   Response:', result);
        } else {
          const errorText = await emailResponse.text();
          console.log(`❌ API route also failed with status ${emailResponse.status}:`, errorText);
        }
      }
    }

    console.log('\n📋 Email Test Complete');
    console.log('If the email was sent successfully, check the recipient inbox.');
    console.log('If there were errors, check:');
    console.log('1. Resend API key validity');
    console.log('2. Domain verification in Resend dashboard');
    console.log('3. Email address format');
    console.log('4. Network connectivity');
    
  } catch (error) {
    console.error('\n❌ Email test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

// Test Resend Configuration
async function testResendDirectly() {
  console.log('\n🔧 Testing Resend API directly...');
  
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Send a simple test email
    const result = await resend.emails.send({
      from: 'Most Valuable <noreply@mostvaluableco.com>',
      to: ['delivered@resend.dev'], // Using Resend's test delivery address
      subject: '🧪 Resend Direct Test - Most Valuable',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
          <h2 style="color: #d4af37;">🧪 Resend Test Email</h2>
          <p>This is a direct test of the Resend email service.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>API Key:</strong> ${process.env.RESEND_API_KEY.substring(0, 10)}...</p>
          <p style="color: #666; font-size: 12px;">
            If you receive this email, the Resend configuration is working correctly.
          </p>
        </div>
      `,
      text: `
Resend Test Email

This is a direct test of the Resend email service.
Timestamp: ${new Date().toISOString()}
API Key: ${process.env.RESEND_API_KEY.substring(0, 10)}...

If you receive this email, the Resend configuration is working correctly.
      `,
    });
    
    console.log('✅ Direct Resend test successful!');
    console.log('   Email ID:', result.id);
    
  } catch (error) {
    console.log('❌ Direct Resend test failed:', error.message);
    
    if (error.message.includes('not verified')) {
      console.log('🔧 Domain verification issue detected.');
      console.log('   Check your Resend dashboard to verify the domain.');
    }
    
    if (error.message.includes('API key')) {
      console.log('🔧 API key issue detected.');
      console.log('   Check if the API key is valid and has the correct permissions.');
    }
  }
}

// Main execution
const args = process.argv.slice(2);
const testEmail = args[0]; // Optional test email argument

if (testEmail && !testEmail.includes('@')) {
  console.log('Usage: node scripts/send-test-email.js [test-email@domain.com]');
  console.log('Example: node scripts/send-test-email.js yourname@gmail.com');
  process.exit(1);
}

console.log('🧪 Most Valuable Email System Test\n');

if (testEmail) {
  console.log(`📧 Sending test email to: ${testEmail}\n`);
} else {
  console.log('📧 Using existing entry email or mock data\n');
}

// Run tests in sequence
testResendDirectly()
  .then(() => sendTestEmail(testEmail))
  .catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
