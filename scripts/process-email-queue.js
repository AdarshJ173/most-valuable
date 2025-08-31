/**
 * Email Queue Processor
 * Processes pending emails in the database and sends them via Resend
 * This script should be run periodically (via cron or manually) to process the email queue
 */

const { ConvexHttpClient } = require("convex/browser");
const { api } = require("../convex/_generated/api");
const { Resend } = require('resend');

require('dotenv').config({ path: '.env.local' });

async function processEmailQueue() {
  console.log('📧 Processing Email Queue...\n');

  // Check environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    console.error('❌ NEXT_PUBLIC_CONVEX_URL not found');
    process.exit(1);
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Get pending emails from the queue
    const pendingEmails = await convex.query(api.emailLogs.getEmailLogs, { 
      limit: 50,
      status: 'pending'
    });

    console.log(`📋 Found ${pendingEmails.length} pending emails to process`);

    if (pendingEmails.length === 0) {
      console.log('✅ No pending emails to process');
      return;
    }

    let successCount = 0;
    let failureCount = 0;

    for (const emailLog of pendingEmails) {
      try {
        console.log(`\n📤 Processing email for ${emailLog.to}...`);
        
        // Parse the email data
        const emailData = JSON.parse(emailLog.data);
        
        if (emailData.type === 'purchase_confirmation') {
          // Get the entry details
          const entry = await convex.query(api.entries.getEntryById, { 
            entryId: emailData.entryId 
          });
          
          if (!entry) {
            console.log(`   ⚠️  Entry not found for ${emailData.entryId}, skipping`);
            continue;
          }

          // Get raffle configuration for dynamic data
          const raffle = await convex.query(api.payments.getRaffleConfigInternal);
          
          if (!raffle) {
            console.log('   ⚠️  No active raffle found, skipping');
            continue;
          }

          // Generate email content (same as API route)
          const endDate = new Date(raffle.endDate);
          const endDateFormatted = endDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
          
          const orderNumber = emailData.entryId.substring(emailData.entryId.length - 8).toUpperCase();

          // Create HTML email (simplified version)
          const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Gold Rush Entry Confirmed - Most Valuable</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { color: #d4af37; font-size: 24px; font-weight: bold; }
        .details-box { background: #ffd700; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .highlight { background: #1a1a1a; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">🏆 Gold Rush Entry Confirmed!</h1>
        <p>Your entry has been confirmed for "The Gold Rush Giveaway"</p>
    </div>
    
    <p>You now officially hold a chance to secure what no one else in the world can claim: <strong>real luxury, built on lasting value.</strong></p>
    
    <div class="details-box">
        <h3>📋 Your Entry Details</h3>
        <p><strong>Entry ID:</strong> ${orderNumber}</p>
        <p><strong>Entries Purchased:</strong> ${entry.count}</p>
        <p><strong>Campaign Ends:</strong> ${endDateFormatted}</p>
        ${entry.variantColor ? `<p><strong>Shirt Color:</strong> ${entry.variantColor}</p>` : ''}
        ${entry.size ? `<p><strong>Shirt Size:</strong> ${entry.size}</p>` : ''}
    </div>
    
    <div class="highlight">
        <p><strong>This isn't hype. This is history.</strong></p>
        <p>Thank you for being one of the first to stand with us.</p>
    </div>
    
    <p><strong>With respect,</strong><br>Most Valuable co.</p>
</body>
</html>`;

          const emailText = `
Gold Rush Entry Confirmed!

Your entry has been confirmed for "The Gold Rush Giveaway"

Entry Details:
• Entry ID: ${orderNumber}
• Entries Purchased: ${entry.count}
• Campaign Ends: ${endDateFormatted}
${entry.variantColor ? `• Shirt Color: ${entry.variantColor}` : ''}
${entry.size ? `• Shirt Size: ${entry.size}` : ''}

This isn't hype. This is history.
Thank you for being one of the first to stand with us.

With respect,
Most Valuable co.
`;

          // Send the email via Resend
          const result = await resend.emails.send({
            from: 'Most Valuable <noreply@mostvaluableco.com>',
            to: [entry.email],
            subject: emailLog.subject,
            html: emailHtml,
            text: emailText,
            headers: {
              'X-Entity-Ref-ID': emailData.entryId,
            },
          });

          console.log(`   ✅ Email sent successfully (ID: ${result.id})`);
          
          // Update the email log status to 'sent'
          await convex.mutation(api.emailLogs.createEmailLog, {
            to: entry.email,
            subject: emailLog.subject,
            message: 'Purchase confirmation email - sent successfully',
            data: JSON.stringify({ ...emailData, emailId: result.id }),
            status: 'sent',
            sentAt: Date.now(),
          });

          successCount++;
          
        } else {
          console.log(`   ⚠️  Unknown email type: ${emailData.type}, skipping`);
        }

      } catch (emailError) {
        console.error(`   ❌ Failed to send email to ${emailLog.to}:`, emailError.message);
        
        // Update email log with error
        try {
          await convex.mutation(api.emailLogs.createEmailLog, {
            to: emailLog.to,
            subject: emailLog.subject,
            message: 'Purchase confirmation email - failed to send',
            data: emailLog.data,
            status: 'failed',
            sentAt: Date.now(),
            error: emailError.message,
          });
        } catch (logError) {
          console.error(`     Failed to log error: ${logError.message}`);
        }
        
        failureCount++;
      }
    }

    console.log(`\n📊 Processing Complete:`);
    console.log(`   ✅ Successfully sent: ${successCount} emails`);
    console.log(`   ❌ Failed to send: ${failureCount} emails`);
    console.log(`   📧 Total processed: ${successCount + failureCount} emails`);

  } catch (error) {
    console.error('\n❌ Email queue processing failed:', error.message);
    process.exit(1);
  }
}

// Run the email queue processor
processEmailQueue();
