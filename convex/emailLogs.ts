import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create email log entry
 */
export const createEmailLog = mutation({
  args: {
    to: v.string(),
    subject: v.string(),
    message: v.string(),
    data: v.string(),
    status: v.string(),
    sentAt: v.number(),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("emailLogs", args);
  },
});

/**
 * Get email logs (admin function)
 */
export const getEmailLogs = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { limit = 50, status }) => {
    let query = ctx.db.query("emailLogs").order("desc");
    
    if (status) {
      query = query.filter((q) => q.eq(q.field("status"), status));
    }

    return await query.take(limit);
  },
});

/**
 * Get failed email logs
 */
export const getFailedEmails = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    return await ctx.db
      .query("emailLogs")
      .withIndex("by_status", (q) => q.eq("status", "failed"))
      .order("desc")
      .take(limit);
  },
});
