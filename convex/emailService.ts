"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal, api } from "./_generated/api";

/**
 * Send purchase confirmation email via API route
 * This avoids Resend dependency issues in Convex
 */
export const sendPurchaseConfirmationEmail = action({
  args: {
    entryId: v.id("entries"),
    email: v.string(),
    count: v.number(),
  },
  handler: async (ctx, { entryId, email, count }): Promise<any> => {
    console.log(`📧 Preparing to send confirmation email to ${email}`);

    try {
      // Call our API route to send the email
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://most-valuable.vercel.app'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          entryId: entryId,
          email: email,
          type: 'purchase_confirmation',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Email API request failed with status ${response.status}:`, errorText);
        throw new Error(`Email API request failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ Email sent successfully to ${email}:`, result);
      
      // Log the email to the database via mutation
      try {
        await ctx.runMutation(api.emailLogs.createEmailLog, {
          to: email,
          subject: `Gold Rush Entry Confirmed - ${count} ${count === 1 ? 'Entry' : 'Entries'} Secured`,
          message: 'Purchase confirmation email',
          data: JSON.stringify({ entryId, emailId: result.emailId }),
          status: 'sent',
          sentAt: Date.now(),
        });
      } catch (logError) {
        console.warn('Failed to log email to database:', logError);
        // Don't fail the email sending if logging fails
      }
      
      return {
        success: true,
        emailId: result.emailId,
        recipient: email,
        entryCount: count,
        method: 'api-route',
      };

    } catch (error: any) {
      console.error(`❌ Failed to send confirmation email to ${email}:`, error);
      
      // Log the failure to the database via mutation
      try {
        await ctx.runMutation(api.emailLogs.createEmailLog, {
          to: email,
          subject: `Gold Rush Entry Confirmed - ${count} ${count === 1 ? 'Entry' : 'Entries'} Secured`,
          message: 'Purchase confirmation email',
          data: JSON.stringify({ entryId, error: error.message }),
          status: 'failed',
          sentAt: Date.now(),
          error: error.message,
        });
      } catch (logError) {
        console.warn('Failed to log email error to database:', logError);
      }
      
      throw new Error(`Email sending failed: ${error.message}`);
    }
  },
});


