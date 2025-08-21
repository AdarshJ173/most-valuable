import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Send notification to admin about new order
 * This function would integrate with email service or admin dashboard
 */
export const notifyAdminOfNewOrder = mutation({
  args: {
    entryId: v.id("entries"),
    email: v.string(),
    count: v.number(),
    amount: v.number(),
    stripeSessionId: v.string(),
  },
  handler: async (ctx, { entryId, email, count, amount, stripeSessionId }) => {
    // Create notification record
    const notificationId = await ctx.db.insert("adminNotifications", {
      type: "new_order",
      title: `New Raffle Entry Purchase`,
      message: `${email} purchased ${count} raffle ${count === 1 ? 'entry' : 'entries'} for $${(amount / 100).toFixed(2)}`,
      data: {
        entryId,
        email,
        count,
        amount,
        stripeSessionId,
      },
      isRead: false,
      createdAt: Date.now(),
    });

    // Log for console monitoring
    console.log(`🎫 NEW RAFFLE ENTRY: ${email} bought ${count} entries for $${(amount / 100).toFixed(2)}`);
    
    // Here you could integrate with external services:
    // - Send email to admin
    // - Send Slack notification
    // - Send SMS alert
    // - Webhook to external system
    
    return notificationId;
  },
});

/**
 * Notify admin about payment failures
 */
export const notifyAdminOfFailedPayment = mutation({
  args: {
    email: v.string(),
    amount: v.number(),
    errorMessage: v.string(),
    stripeSessionId: v.string(),
  },
  handler: async (ctx, { email, amount, errorMessage, stripeSessionId }) => {
    const notificationId = await ctx.db.insert("adminNotifications", {
      type: "payment_failed",
      title: `Payment Failed`,
      message: `Payment failed for ${email}: $${(amount / 100).toFixed(2)} - ${errorMessage}`,
      data: {
        email,
        amount,
        errorMessage,
        stripeSessionId,
      },
      isRead: false,
      createdAt: Date.now(),
    });

    console.log(`❌ PAYMENT FAILED: ${email} - $${(amount / 100).toFixed(2)} - ${errorMessage}`);
    
    return notificationId;
  },
});

/**
 * Get unread admin notifications
 */
export const getUnreadNotifications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("adminNotifications")
      .withIndex("by_read_status", (q) => q.eq("isRead", false))
      .order("desc")
      .take(50);
  },
});

/**
 * Mark notification as read
 */
export const markNotificationAsRead = mutation({
  args: {
    notificationId: v.id("adminNotifications"),
  },
  handler: async (ctx, { notificationId }) => {
    await ctx.db.patch(notificationId, { isRead: true });
  },
});

/**
 * Get all notifications (paginated)
 */
export const getAllNotifications = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, { limit = 20, cursor }) => {
    let query = ctx.db.query("adminNotifications").order("desc");
    
    if (cursor) {
      query = query.filter((q) => q.lt(q.field("createdAt"), parseInt(cursor)));
    }
    
    const notifications = await query.take(limit);
    
    return {
      notifications,
      nextCursor: notifications.length === limit 
        ? notifications[notifications.length - 1].createdAt.toString() 
        : null,
    };
  },
});

/**
 * Notify admin of winner selection
 */
export const notifyAdminOfWinner = mutation({
  args: {
    winnerEmail: v.string(),
    winningTicketNumber: v.number(),
    totalTickets: v.number(),
    raffleConfigId: v.id("raffleConfig"),
  },
  handler: async (ctx, { winnerEmail, winningTicketNumber, totalTickets, raffleConfigId }) => {
    // Create notification record
    const notificationId = await ctx.db.insert("adminNotifications", {
      type: "winner_selected",
      title: `🏆 Raffle Winner Selected!`,
      message: `Winner: ${winnerEmail} | Winning ticket: #${winningTicketNumber} out of ${totalTickets} total tickets`,
      data: {
        winnerEmail,
        winningTicketNumber,
        totalTickets,
        raffleConfigId,
        winningProbability: ((1 / totalTickets) * 100).toFixed(4)
      },
      isRead: false,
      createdAt: Date.now(),
    });

    // Log for console monitoring
    console.log(`🏆 RAFFLE WINNER SELECTED: ${winnerEmail} won with ticket #${winningTicketNumber}/${totalTickets}`);
    
    return notificationId;
  },
});

/**
 * Send email notification to admin (placeholder for actual email service)
 */
export const sendEmailNotification = mutation({
  args: {
    to: v.string(),
    subject: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, { to, subject, message, data }) => {
    // This is where you would integrate with an email service like:
    // - SendGrid
    // - Nodemailer
    // - AWS SES
    // - Mailgun
    
    console.log(`📧 EMAIL NOTIFICATION:
To: ${to}
Subject: ${subject}
Message: ${message}
Data: ${JSON.stringify(data, null, 2)}`);
    
    // Store the email notification attempt
    return await ctx.db.insert("emailLogs", {
      to,
      subject,
      message,
      data: JSON.stringify(data || {}),
      status: "pending", // would be "sent" or "failed" with real email service
      sentAt: Date.now(),
    });
  },
});
