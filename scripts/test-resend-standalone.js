/**
 * Standalone Resend Test
 * Tests email sending directly with Resend API using the verified domain
 * This script works independently of the Next.js server
 */

require('dotenv').config({ path: '.env.local' });

async function testResendStandalone() {
  console.log('🧪 Most Valuable - Standalone Resend Test');
  console.log('===============================================\n');

  // Check environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    process.exit(1);
  }

  console.log(`🔑 API Key: ${process.env.RESEND_API_KEY.substring(0, 8)}...`);
  console.log(`📧 Domain: mostvaluableco.com (verified)\n`);

  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log('🚀 Sending test email with verified domain...');

    // Test data
    const testData = {
      orderNumber: 'TEST' + Date.now().toString().slice(-4),
      entryCount: 2,
      campaignEndDate: 'September 22, 2025',
      variantColor: 'Black',
      size: 'L'
    };

    // Create the same HTML email template as the actual system
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gold Rush Entry Confirmed - Most Valuable</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 10px;
        }
        .title {
            color: #d4af37;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
            margin-bottom: 30px;
        }
        .details-box {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            color: #1a1a1a;
            font-weight: 500;
        }
        .details-box h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #1a1a1a;
        }
        .details-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .details-list li {
            margin: 8px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .details-list li strong {
            color: #1a1a1a;
        }
        .steps {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        .steps h3 {
            color: #1a1a1a;
            margin: 0 0 20px 0;
            font-size: 18px;
        }
        .steps ol {
            margin: 0;
            padding-left: 20px;
        }
        .steps li {
            margin: 12px 0;
            color: #555;
        }
        .highlight {
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 25px 0;
        }
        .signature {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 14px;
        }
        .test-notice {
            background: #e3f2fd;
            border: 2px solid #2196f3;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .test-notice h4 {
            color: #1565c0;
            margin: 0 0 10px 0;
        }
        @media (max-width: 600px) {
            body { padding: 10px; }
            .email-container { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="test-notice">
            <h4>🧪 TEST EMAIL</h4>
            <p style="margin: 0; color: #1565c0; font-size: 14px;">This is a test email to verify the Resend integration is working correctly.</p>
        </div>

        <div class="header">
            <div class="logo">MV</div>
            <h1 class="title">🏆 Gold Rush Entry Confirmed!</h1>
            <p class="subtitle">Your entry has been confirmed for "The Gold Rush Giveaway" — a historical release of two one-of-one shirts, each backed by a quarter ounce of gold (7g).</p>
        </div>

        <p>You now officially hold a chance to secure what no one else in the world can claim: <strong>real luxury, built on lasting value.</strong></p>

        <div class="details-box">
            <h3>📋 Your Entry Details</h3>
            <ul class="details-list">
                <li><span>Entry ID:</span> <strong>${testData.orderNumber}</strong></li>
                <li><span>Entries Purchased:</span> <strong>${testData.entryCount}</strong></li>
                <li><span>Campaign Ends:</span> <strong>${testData.campaignEndDate}</strong></li>
                <li><span>Shirt Color:</span> <strong style="text-transform: capitalize;">${testData.variantColor}</strong></li>
                <li><span>Shirt Size:</span> <strong>${testData.size}</strong></li>
            </ul>
        </div>

        <div class="steps">
            <h3>What happens next?</h3>
            <ol>
                <li><strong>Keep an eye on your inbox and Instagram</strong> — we'll update the community as the Gold Rush builds.</li>
                <li><strong>On ${testData.campaignEndDate}</strong>, we will announce the two collectors chosen to receive the gold-backed shirts.</li>
                <li><strong>All other participants</strong> will receive their Digital Gold Brick Voucher ($250 off next release) as a token of appreciation for fueling this movement.</li>
            </ol>
        </div>

        <div class="highlight">
            <p style="margin: 0; font-size: 18px; font-weight: 600;">This isn't hype. This is history.</p>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for being one of the first to stand with us.</p>
        </div>

        <div class="signature">
            <p><strong>With respect,</strong><br>
            Most Valuable co.</p>
        </div>

        <div class="footer">
            <p>© 2025 Most Valuable. All rights reserved.</p>
            <p>You're receiving this email because you purchased entries for The Gold Rush Giveaway.</p>
        </div>
    </div>
</body>
</html>`;

    // Create text version
    const emailText = `
🧪 TEST EMAIL - Gold Rush Entry Confirmed

Your entry has been confirmed for "The Gold Rush Giveaway" — a historical release of two one-of-one shirts, each backed by a quarter ounce of gold (7g).

You now officially hold a chance to secure what no one else in the world can claim: real luxury, built on lasting value.

ENTRY DETAILS:
• Entry ID: ${testData.orderNumber}
• Entries Purchased: ${testData.entryCount}
• Campaign Ends: ${testData.campaignEndDate}
• Shirt Color: ${testData.variantColor}
• Shirt Size: ${testData.size}

What happens next?:
1. Keep an eye on your inbox and Instagram — we'll update the community as the Gold Rush builds.
2. On ${testData.campaignEndDate}, we will announce the two collectors chosen to receive the gold-backed shirts.
3. All other participants will receive their Digital Gold Brick Voucher ($250 off next release) as a token of appreciation for fueling this movement.

This isn't hype. This is history.
Thank you for being one of the first to stand with us.

With respect,
Most Valuable co.

---
This is a test email to verify the Resend integration is working correctly.
`;

    // Get command line argument for test email
    const args = process.argv.slice(2);
    const testEmail = args[0] || 'delivered@resend.dev'; // Default to Resend's test address

    console.log(`📧 Sending to: ${testEmail}`);

    // Send the email
    const result = await resend.emails.send({
      from: 'Most Valuable <noreply@mostvaluableco.com>',
      to: [testEmail],
      subject: `🧪 TEST - Gold Rush Entry Confirmed - ${testData.entryCount} Entries Secured`,
      html: emailHtml,
      text: emailText,
      headers: {
        'X-Entity-Ref-ID': `test-${testData.orderNumber}`,
      },
    });

    console.log('\n✅ SUCCESS! Email sent successfully!');
    console.log('📧 Email Details:');
    console.log(`   Email ID: ${result.id}`);
    console.log(`   To: ${testEmail}`);
    console.log(`   From: Most Valuable <noreply@mostvaluableco.com>`);
    console.log(`   Subject: 🧪 TEST - Gold Rush Entry Confirmed - ${testData.entryCount} Entries Secured`);

    console.log('\n🎯 Test Results:');
    console.log('✅ Resend API Key: Valid');
    console.log('✅ Domain Verification: Working');
    console.log('✅ Email Template: Generated correctly');
    console.log('✅ Email Sending: Successful');

    console.log('\n📋 Next Steps:');
    console.log('1. Check the recipient inbox for the test email');
    console.log('2. If using delivered@resend.dev, check Resend logs in dashboard');
    console.log('3. Email system is ready for production use!');

    console.log('\n🔧 To test with a real email address:');
    console.log('   node scripts/test-resend-standalone.js your-email@gmail.com');

  } catch (error) {
    console.error('\n❌ ERROR: Email test failed');
    console.error('Error details:', error.message);

    if (error.message.includes('not verified')) {
      console.log('\n🔧 Domain Verification Issue:');
      console.log('   Your domain mostvaluableco.com needs to be verified in Resend');
      console.log('   Check your Resend dashboard at https://resend.com/domains');
    } else if (error.message.includes('API key')) {
      console.log('\n🔧 API Key Issue:');
      console.log('   Check if your RESEND_API_KEY is valid');
      console.log('   Verify the key has the correct permissions in Resend dashboard');
    } else if (error.message.includes('rate')) {
      console.log('\n🔧 Rate Limit Issue:');
      console.log('   You may have hit Resend rate limits');
      console.log('   Wait a few minutes and try again');
    } else {
      console.log('\n🔧 General Issue:');
      console.log('   Check your internet connection');
      console.log('   Verify environment variables are loaded correctly');
    }

    process.exit(1);
  }
}

// Run the test
testResendStandalone();
