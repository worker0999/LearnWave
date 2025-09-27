import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getPlacements = query({
  args: {
    status: v.optional(v.union(v.literal("upcoming"), v.literal("ongoing"), v.literal("completed"))),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("placements")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }

    return await ctx.db.query("placements").order("desc").collect();
  },
});

export const getEligiblePlacements = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const student = await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!student) return [];

    const allPlacements = await ctx.db
      .query("placements")
      .withIndex("by_status", (q) => q.eq("status", "upcoming"))
      .collect();

    return allPlacements.filter(placement => {
      // Check branch eligibility
      const branchEligible = placement.eligibleBranches.includes(student.branch) || 
                           placement.eligibleBranches.includes("All");
      
      // Check CGPA criteria
      const cgpaEligible = !placement.cgpaCriteria || 
                          !student.cgpa || 
                          student.cgpa >= placement.cgpaCriteria;

      return branchEligible && cgpaEligible;
    });
  },
});

export const addPlacement = mutation({
  args: {
    companyName: v.string(),
    role: v.string(),
    package: v.optional(v.string()),
    eligibleBranches: v.array(v.string()),
    cgpaCriteria: v.optional(v.number()),
    description: v.string(),
    applicationDeadline: v.optional(v.number()),
    driveDate: v.optional(v.number()),
    status: v.union(v.literal("upcoming"), v.literal("ongoing"), v.literal("completed")),
    requirements: v.optional(v.array(v.string())),
    contactInfo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user is admin (you might want to add this check)
    return await ctx.db.insert("placements", args);
  },
});
